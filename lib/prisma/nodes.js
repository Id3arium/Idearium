import prisma from '.'
import { uniqueTimelineNodeIDsAtom } from '@/public/atoms.js';

export async function getNodes() {
    try {
        const nodes = await prisma.node.findMany()
        console.log("nodes.js getNodes() getting", nodes.length, "nodes fromBD")
        const nodesWithISOStringDates = nodes.map((node) => ({
            ...node,
            created: new Date(node.created).toISOString(),
            lastModified: new Date(node.lastModified).toISOString(),
        }));
        return { nodesWithISOStringDates }
    } catch (error) {
        console.log("getNodes error:", error)
        return error
    }
}

export async function getNextRandomNode(currNodeID) {
    try {
        const nodesCount = await prisma.node.count()
        if (nodesCount == 0) return { node: null }
        if (nodesCount == 1) {
            const onlyNode = await prisma.node.findFirst()
            return { node: onlyNode }
        }

        let randNode = await getWeightedRandomNode()
        while (currNodeID != 'null' && (currNodeID == randNode.id)) {
            randNode = await getWeightedRandomNode()
        }
        return { node: randNode }
    } catch (error) {
        console.log("getNodes error:", error)
        return error
    }
}

export async function createNode(node) {
    try {
        const nodesCount = await prisma.node.count();
        node.idx = nodesCount;
        node.ranking = nodesCount + 1;
        node.frequency = 1 / (nodesCount + 1);

        await downRegulateNodeFrequencies(nodesCount);

        const prevNode = await getNodeWithHighestIdxLowerThan(node.idx);
        node.frequencySigma = prevNode ? (prevNode.frequencySigma + prevNode.frequency) : 0;
        node.frequencySigmaPlusFrequency = node.frequencySigma + node.frequency;
        
        const createdNode = await prisma.node.create({ data: node });
        console.log("nodes.createNode() createdNode:", createdNode);
        return { node: createdNode };
    } catch (error) {
        console.log("createNode error:", error);
        return error;
    }
}

export async function deleteNode(nodeID) {
    try {
        console.log("nodes.deleteNode() deleting node with ID:", nodeID)
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
        return { node: deletedNode }
    } catch (error) {
        console.log("deleteNode error:", error)
        return error
    }
}

export async function getNodeByID(nodeID) {
    try {
        const node = await prisma.node.findUnique({
            where: { id: nodeID },
            // include: {tweets: true}
        })
        console.log("nodes.getNodeByID() node:", node)
        return { node }
    } catch (error) {
        console.log("nodes.getNodeByID() error:", error)
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
                frequencySigma: {
                    lte: randNum,
                },
                frequencySigmaPlusFrequency: {
                    gt: randNum,
                },
            },
        });

        // If no matching node is found, return the last node based on the 'idx' column
        if (!randNode) {
            const lastNode = await prisma.node.findFirst({
                orderBy: {
                    idx: 'desc',
                },
            });
            if (lastNode) {
                return lastNode;
            } 
        }
        return randNode;
    } catch (error) {
        console.log("nodes.getWeightedRandomNode() error:", error);
        return { error };
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










