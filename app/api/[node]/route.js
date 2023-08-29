import { NextResponse } from "next/server"
import { useSearchParams } from 'next/navigation';
import { parse } from 'url';
import qs from 'qs';
import * as nodesDB from "@/lib/prisma/nodes.js"

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

async function doPromise(callback) {
   console.log('router.doPromise:', callback.name)
   // const { res, err } = await callback();
   // if (err) {
   //    throw new Error(err);
   // }
   const res = await callback();
   return NextResponse.json(res);
}

export async function GET(request, { params }) {
   const searchParams = request.nextUrl.searchParams

   const hasNextRandomNodeParam = searchParams.get('next-random-node') === 'true';
   const currNodeId = searchParams.get('curr-node-id');

   const hasGetNodeByIdParam = searchParams.get('get-node-by-id') === 'true';
   const nodeId = searchParams.get('node-id');

   try {
      if (hasNextRandomNodeParam) {
         console.log('route.GET, getNextRandomNode')
         return await doPromise(() => nodesDB.getNextRandomNode(currNodeId));
      }
      else if (hasGetNodeByIdParam) {
         console.log('route.GET, getNodeByID')
         return await doPromise(() => nodesDB.getNodeByID(nodeId));
      }
      else {
         console.log('route.GET, getNodes')
         return await doPromise(() => nodesDB.getNodes());
      }
   } catch (error) {
      return NextResponse.json({ error: error.message });
   }
}

export async function POST(request, { params }) {
   const data = await request.json()

   console.log("route.POST")

   try {
      return await doPromise(() => nodesDB.createNode(data))
   } catch (error) {
      return NextResponse.json({ error: error.message })
   }
}

export async function PUT(request, { params }) {
   const data = await request.json()

   const resetFrequencies = data['reset-frequencies']
   const frequencyChange = data['frequency-change']
   const nodeIdx = data['node-idx']
   console.log("route.PUT data", data)
   
   try {
      if (typeof frequencyChange !== "undefined") {
         return await doPromise(() => nodesDB.redistributeNodeFrequencies(frequencyChange, nodeIdx))
      }
      else if (typeof resetFrequencies !== "undefined") {
         return await doPromise(() => nodesDB.resetNodeFrequencies(data))
      } else {
         return await doPromise(() => nodesDB.updateNodes(data))
      }
   }
   catch (error) {
      return NextResponse.json({ error: error.message })
   }
}

export async function DELETE(request, { params }) {
   const searchParams = request.nextUrl.searchParams
   const nodeID = searchParams.get('node-id');
   // const data = await request.json() 
   console.log("route.DELETE, removing node with id", nodeID)
   try {
      const { node, error } = await nodesDB.deleteNode(nodeID)
      if (error) {
         throw new Error(error)
      }
      return NextResponse.json({ node })
   } catch (error) {
      return NextResponse.json({ error: error.message })
   }
}