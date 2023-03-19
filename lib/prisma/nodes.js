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

export async function createNode(node) {
    try {
        const nodesCount = await prisma.node.count()
        node.idx = nodesCount,
        node.frequency = 1 / (nodesCount + 1)
        node.ranking = nodesCount + 1

        await prisma.node.updateMany({
            data: {
                frequency: {
                    multiply: nodesCount / (nodesCount + 1),
                },
            }
        })
        const createdNode = await prisma.node.create({ data: node })
        console.log("createNode() createdNode:", createdNode)
        return {node: createdNode}
    } catch(error) {
        console.log("createNode error:", error)
        return error
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
            await prisma.node.updateMany({
                data: {
                    frequency: {
                        multiply: (nodesCount + 1) / nodesCount,
                    },
                }
            })
            console.log("deleteNode updating node frquencies by a factor of:", ((nodesCount + 1) / nodesCount))
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