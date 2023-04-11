import { NextResponse } from "next/server" 
import { useSearchParams } from 'next/navigation';
import { parse } from 'url';
import qs from 'qs';
import { getNodes, createNode, deleteNode, getNextRandomNode } from "@/lib/prisma/nodes"

// export async function GET(request, { params }) {
//     // const data = await request.json()
//     // console.log("GET data:", data)
//     console.log("GET request params", params)
//     try {
//         if (request.headers.get("X-Next-Random-Node")) {
//             const currNodeID = request.headers.get("X-Current-Node-ID");
//             console.log("GET request.headers X-Current-Node-ID", currNodeID)

//             const {node, error} = await getNextRandomNode(currNodeID)
//             if (error) { throw new Error(error) }
//             return NextResponse.json({node})
//         } else { 
//             const {nodes, error} = await getNodes()
//             if (error) { throw new Error(error) }
//             return NextResponse.json({nodes})
//         }
//     } catch (error) {
//         return NextResponse.json({error: error.message})
//     }
// }

export async function GET(request) {
    
    const searchParams = request.nextUrl.searchParams
    const nextRandomNode = searchParams.get('next-random-node') === 'true';
    const currNodeId = searchParams.get('curr-node-id');
    console.log('GET request currNodeId', currNodeId);
    console.log('GET request nextRandomNode', nextRandomNode);
    console.log('GET request searchParams', searchParams);
  
    try {
      if (nextRandomNode) {
  
        const { node, error } = await getNextRandomNode(currNodeId);
        if (error) {
          throw new Error(error);
        }
        return NextResponse.json({ node });
      } else {
        const { nodes, error } = await getNodes();
        if (error) {
          throw new Error(error);
        }
        return NextResponse.json({ nodes });
      }
    } catch (error) {
      return NextResponse.json({ error: error.message });
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