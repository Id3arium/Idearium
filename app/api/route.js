import {NextRequest, NextResponse} from "next/server" 
import { getNodes } from "@/lib/prisma/nodes"

export async function GET(request, { params }) {
    try {
        const {nodes, error} = await getNodes()
        if (error) { throw new Error(error) }

        return NextResponse.json({nodes})
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}

export async function POST(request) {
    return NextResponse.json({ message: "hello World!" })
}

export async function PUT(request) {
    return NextResponse.json({ message: "hello World!" })
}

export async function DELETE(request) {
    return NextResponse.json({ message: "hello World!" })
}