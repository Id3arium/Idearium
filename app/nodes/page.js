import { getNodes } from '@/lib/prisma/nodes.js'

const Page = async () => {
    const nodes = await getNodes()
    console.log("Nodes Page nodes:", nodes.nodes)
    return <div>Nodes Page</div>
}

export default Page