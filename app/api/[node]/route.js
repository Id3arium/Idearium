import { NextResponse } from "next/server" 
import { getNodes, createNode, deleteNode } from "@/lib/prisma/nodes"

// export async function POST(request, { params }) {
//     console.log("app/api/[id]/route.js POST","request",request,"params",params)
//     return NextResponse.json({ message: `hello ${params.id}!` })
// }

export async function GET(request, { params }) {
    try {
        console.log("GET params", params)
        const {nodes, error} = await getNodes()
        if (error) { throw new Error(error) }
        
        console.log("GET got nodes:", nodes)
        return NextResponse.json({nodes})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}

export async function POST(request, { params }) {
    console.log("app/api/[node]/route.js POST", "params", params)
    const data = await request.json()
    try {
        console.log("POST creating node with data", data)
        const { node, error } = await createNode(data)
        
        if (error) {
            throw new Error(error)
        }
        return NextResponse.json({node})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}

export async function PUT(request, { params }) {
    console.log("PUT data", data)
    try {
        const data = JSON.parse(params.id)
        console.log("PUT data", data)
        const { node, error } = await updateNode(data)
        
        if (error) {
            throw new Error(error)
        }
        return NextResponse.json({node})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}

export async function DELETE(request, { params }) {
    try {
        const data = JSON.parse(params.id)
        console.log("DELETE data", data)
        const { node, error } = await deleteNode(data)
        
        if (error) {
            throw new Error(error)
        }
        return NextResponse.json({node})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }

}