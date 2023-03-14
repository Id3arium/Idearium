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
        console.log("createNode creating node:", node)
        // const nodes = await prisma.node.findMany()
        const nodeFromDB = await prisma.node.create({ data: node })
        console.log("createNode node:", nodeFromDB)
        if (node == null) {
            const nodes = await prisma.node.findMany()
            const testNode = {
                "idx" : nodes.length,
                "title": "Be A First Class Noticer",
                "content": "Become the type of person on whom nothing is lost, by changing the way you look at things. Because if you change the way you look at things, the things you look at change.",
                "inspiration": "Mark Goulston, Amy Herman",
                "frequency": 1,
                "ranking": nodes.length + 1,
            }
            console.log("createNode creating testNode:", testNode)
            return {node: testNode}
        }
        return {node: nodeFromDB}
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