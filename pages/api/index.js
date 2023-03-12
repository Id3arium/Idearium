import { getNodes, createNode } from "@/lib/prisma/nodes"

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            console.log("GET res", res)
            const { nodes, error } = await getNodes()
            console.log("GET got nodes:", nodes)
            if (error) throw new Error(error)
            return res.status(200).json({ nodes })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    if (req.method === 'POST') {
        try {
            const data = req.body
            console.log("POST data", data)
            const { node, error } = await createNode(data)
            console.log("POST created node:", node)
            if (error) throw new Error(error)
            return res.status(200).json({ node })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(425).end(`Method ${req.method} is not allowed.`)
}

export default handler

// import { NextResponse } from "next/server" 
// import { getNodes, createNode } from "@/lib/prisma/nodes"

// export async function GET(req, { params }) {
//     try {
//         console.log("GET params", params)
//         const {nodes, error} = await getNodes()
//         if (error) { throw new Error(error) }
        
//         console.log("GET got nodes:", nodes)
//         return NextResponse.json({nodes})
//     } catch (error) {
//         return NextResponse.json({error: error.message})
//     }
// }

// export async function POST(req, { params }) {
//     try {
//         const data = params
//         console.log("POST creating node with data", params)
//         const { node, error } = await createNode(data)
        
//         if (error) {
//             throw new Error(error)
//         }
//         return NextResponse.json({node})
//     } catch (error) {
//         return NextResponse.json({error: error.message})
//     }
// }

// export async function PUT(request) {
//     return NextResponse.json({ message: "hello World!" })
// }

// export async function DELETE(request) {
//     return NextResponse.json({ message: "hello World!" })
// }