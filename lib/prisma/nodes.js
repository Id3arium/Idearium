import prisma from '.'

export async function getNodes() {
    try {
        const nodes = await prisma.node.findMany()
        console.log("getNodes nodes from DB:", nodes)
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
        return {node: createdNode}
    } catch(error) {
        console.log("createNode error:", error)
        return error
    }
}

export async function deleteNode(nodeID) {
    try {
        console.log("createNode deleting with ID:", nodeID)
        const deletedNode = await prisma.node.delete({
            where: {
                id: {
                    equals: nodeID
                }
            }
        })
        console.log("createNode nodeFromDB:", nodeFromDB)
        
        return {node: deletedNode}
    } catch(error) {
        console.log("createNode error:", error)
        return error
    }
}

export async function getNodeByID(id) {
    try {
        const node = await prisma.node.findUnique({
            where: { id },
            // include: {tweets: true}
        })
        console.log("getNodeByID node:", node)
        return {node}
    } catch(error) {
        console.log("getNodeByID error:", error)
        return error
    }
}