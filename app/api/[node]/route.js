import { NextResponse } from "next/server"
import { useSearchParams } from 'next/navigation';
import { parse } from 'url';
import qs from 'qs';
import { getNodes, createNode, deleteNode, getNextRandomNode, getNodeByID } from "@/lib/prisma/nodes"

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

   const hasNextRandomNodeParam = searchParams.get('next-random-node') === 'true';
   const currNodeId = searchParams.get('curr-node-id');

   const hasGetNodeByIdParam = searchParams.get('get-node-by-id') === 'true';
   const nodeId = searchParams.get('node-id');

   try {
      if (hasNextRandomNodeParam) {
         return await doGetNextRandomNode(currNodeId);
      } else if (hasGetNodeByIdParam) {
         return await doGetNodeByID(nodeId);
      } else {
         return await doGetNodes();
      }
   } catch (error) {
      return NextResponse.json({ error: error.message });
   }

   async function doGetNodes() {
      const { nodes, error } = await getNodes();
      if (error) {
         throw new Error(error);
      }
      return NextResponse.json({ nodes });
   }

   async function doGetNodeByID(nodeId) {
      const { node, error } = await getNodeByID(nodeId);
      if (error) {
         throw new Error(error);
      }
      return NextResponse.json({ node });
   }

   async function doGetNextRandomNode(currNodeId) {
      const { node, error } = await getNextRandomNode(currNodeId);
      if (error) {
         throw new Error(error);
      }
      return NextResponse.json({ node });
   }
}

export async function POST(request) {
   const data = await request.json()
   try {
      const { node, error } = await createNode(data)
      if (error) {
         throw new Error(error)
      }
      return NextResponse.json({ node })
   } catch (error) {
      return NextResponse.json({ error: error.message })
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
      return NextResponse.json({ node })
   } catch (error) {
      return NextResponse.json({ error: error.message })
   }
}

export async function DELETE(request, { params }) {
   const searchParams = request.nextUrl.searchParams
   const nodeID = searchParams.get('node-id');
   // const data = await request.json() 
   console.log("DELETE removing node with id", nodeID)
   try {
      const { node, error } = await deleteNode(nodeID)
      if (error) {
         throw new Error(error)
      }
      return NextResponse.json({ node })
   } catch (error) {
      return NextResponse.json({ error: error.message })
   }
}