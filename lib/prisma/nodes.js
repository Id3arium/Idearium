import prisma from '.'

export async function getNodes() {
    try {
        const nodes = prisma.node.findMany()
        console.log("getNodes nodes from DB:", nodes)
        return {nodes}
    } catch(error) {
        console.log("getNodes error:", error)
        return error
    }
}

export async function createNode(node) {
    try {
        const nodeFromDB = prisma.node.create({data: node})
        console.log("createNode node:", node)
        return {node: nodeFromDB}
    } catch(error) {
        console.log("createNode error:", error)
        return error
    }
}

export async function getNodeByID(id) {
    try {
        const node = prisma.node.findUnique({
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