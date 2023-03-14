import {NextRequest, NextResponse} from "next/server" 


export async function GET(request, { params }) {
    console.log("GET","request",request,"params",params)
    const id = params.id
    const {searchParams} = request.nextUrl
    const sort = searchParams.get("sort")
    return NextResponse.json(
        { message: "Hello", id, sort },
        { status: 201 }
    )
}

export async function POST(request, { params }) {
    console.log("POST","request",request,"params",params)
    return NextResponse.json({ message: `hello ${params.id}!` })
}

export async function PUT(request) {
    return NextResponse.json({ message: `hello ${params.id}!` })
}

export async function DELETE(request) {
    return NextResponse.json({ message: `hello ${params.id}!` })
}