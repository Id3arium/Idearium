import prisma from '.'

export async function getNodes() {
    try {
        const nodes = await prisma.node.findMany()
        console.log("nodes.js getNodes() getting", nodes.length, "nodes fromBD")
        return {nodes}
    } catch(error) {
        console.log("getNodes error:", error)
        return error
    }
}

export async function getNextRandomNode(currNodeID) {
    try {
        const nodesCount = await prisma.node.count()
        if (nodesCount == 0) return {node: null}
        if (nodesCount == 1) {
            const onlyNode = await prisma.node.findFirst()
            return {node: onlyNode}
        }
	
        let randNode = await getWeightedRandomNode()
        while (currNodeID != null && (currNodeID == randNode.id)){
            randNode = await getWeightedRandomNode()
        }
        console.log("nodes.js getNextRandomNode() currNodeID", currNodeID, "randNode", randNode)
        return {node: randNode}
    } catch(error) {
        console.log("getNodes error:", error)
        return error
    }
}

export async function createNode(node) {
    try {
        const nodesCount = await prisma.node.count();
        node.idx = nodesCount;
        node.frequency = 1 / (nodesCount + 1);
        node.ranking = nodesCount + 1;

        await downRegulateNodeFrequencies(nodesCount);

        const prevNode = await getNodeWithHighestIdxLowerThan(node.idx);
        node.frequencySigma = prevNode ? (prevNode.frequencySigma + prevNode.frequency) : 0;

        const createdNode = await prisma.node.create({ data: node });
        console.log("createNode() createdNode:", createdNode);
        return { node: createdNode };
    } catch (error) {
        console.log("createNode error:", error);
        return error;
    }
}

export async function deleteNode(nodeID) {
    try {
        console.log("nodes.js: deleteNode deleting node with ID:", nodeID)
        const deletedNode = await prisma.node.delete({
            where: { 
                id: nodeID
            }
        })
        if (deletedNode) {
            const nodesCount = await prisma.node.count()
            await upRegulateNodeFrequencies(nodesCount)
            await updateNodeRankings(deletedNode.ranking)
            await updateFrequencySigmas(deletedNode.idx, deletedNode.frequency);
        }
        return {node: deletedNode}
    } catch(error) {
        console.log("deleteNode error:", error)
        return error
    }
}

export async function getNodeByID(nodeID) {
    try {
        const node = await prisma.node.findUnique({
            where: { id : nodeID },
            // include: {tweets: true}
        })
        console.log("getNodeByID node:", node)
        return {node}
    } catch(error) {
        console.log("getNodeByID error:", error)
        return error
    }
}

async function upRegulateNodeFrequencies(nodesCount) {
    await prisma.node.updateMany({
        data: {
            frequency: {
                multiply: (nodesCount + 1) / nodesCount
            }
        }
    })
}
async function downRegulateNodeFrequencies(nodesCount) {
    await prisma.node.updateMany({
        data: {
            frequency: {
                multiply: nodesCount / (nodesCount + 1),
            },
        }
    })
}

async function updateNodeRankings(currNodeRanking) {
    await prisma.node.updateMany({
        where: {
            ranking: {
                gt: currNodeRanking
            }
        },
        data: {
            ranking: {
                decrement: 1
            }
        }
    })
}

async function updateFrequencySigmas(deletedNodeIdx, deletedNodeFrequency) {
    await prisma.node.updateMany({
        where: {
            idx: {
                gt: deletedNodeIdx,
            },
        },
        data: {
            frequencySigma: {
                decrement: deletedNodeFrequency,
            },
        },
    });
}

async function getWeightedRandomNode() {
    const randNum = Math.random(); // range of [0,1)
    try {
        const randNode = await prisma.node.findFirst({
            where: {
                AND: [
                    {
                        frequencySigma: {
                            lte: randNum,
                        },
                    },
                    {
                        frequencySigma_plus_frequency: {
                            gt: randNum,
                        },
                    },
                ],
            },
        });
        return {node: randNode}
    } catch(error) {
        console.log("createNode error:", error)
        return error
    }
}

async function getNodeWithHighestIdxLowerThan(idx) {
    const node = await prisma.node.findFirst({
        where: {
            idx: {
                lt: idx,
            },
        },
        orderBy: {
            idx: 'desc',
        },
    });
    return node;
}










