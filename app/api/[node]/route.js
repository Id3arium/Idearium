import { NextResponse } from "next/server" 
import { getNodes, createNode, deleteNode } from "@/lib/prisma/nodes"

export async function GET(request) {
    try {
        const {nodes, error} = await getNodes()
        if (error) { throw new Error(error) }
        return NextResponse.json({nodes})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}

export async function POST(request) {
    const data = await request.json()
    try {
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
    const data = await request.json()
    console.log("PUT updating node with id", data)
    const { node, error } = await updateNode(data)
    try {
        if (error) {
            throw new Error(error)
        }
        return NextResponse.json({node})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}

export async function DELETE(request, { params }) {
    const data = await request.text()
    console.log("DELETE removing node with", typeof data, " id", data)
    try {
        const { node, error } = await deleteNode(data)
        if (error) {
            throw new Error(error)
        }
        return NextResponse.json({node})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}