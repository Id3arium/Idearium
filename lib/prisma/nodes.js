import prisma, { node } from '.'
import _ from 'lodash';

export async function getNodes() {
   try {
      const nodes = await prisma.node.findMany()
      console.log("nodes.getNodes getting:", nodes.length, "nodes fromBD")
      const nodesWithISOStringDates = nodes.map((node) => ({
         ...node,
         created: new Date(node.created).toISOString(),
         lastModified: new Date(node.lastModified).toISOString(),
      }));
      return nodesWithISOStringDates
   } catch (error) {
      console.error("nodes.getNodes error:", error)
      return error
   }
}

export async function getNextRandomNode(currNodeID) {
   try {
      const nodesCount = await prisma.node.count()
      if (nodesCount == 0) return { node: null }
      if (nodesCount == 1) {
         const onlyNode = await prisma.node.findFirst()
         return { node: onlyNode }
      }

      let randNode = await getWeightedRandomNode()
      while (currNodeID != 'null' && (currNodeID == randNode.id)) {
         randNode = await getWeightedRandomNode()
      }
      return randNode
   } catch (error) {
      console.error("nodes.getNextRandomNode:", error)
      return error
   }
}

export async function createNode(nodeData) {
   try {
      // console.log("nodes.createNode creating node from:", nodeData);
      // const {id, ...newNodeData} = nodeData
      const createdNode = await prisma.node.create({ data: nodeData })
      console.log("nodes.createNode created node from:", createdNode);
      return createdNode
   } catch (error) {
      console.error("nodes.createNode error:", error);
      return error;
   }
}

export async function deleteNode(nodeID) {
   try {
      console.log("nodes.deleteNode deleting node with ID:", nodeID)
      const deletedNode = await prisma.node.delete({
         where: { id: nodeID }
      })
      if (deletedNode) {
         console.log("nodes.deleteNode deletedNode", deletedNode)
         const nodesCount = await prisma.node.count()

      }
      return deletedNode
   } catch (error) {
      console.error("nodes.deleteNode error:", error)
      return error
   }
}

export async function updateNodes(nodes) {
   console.log("nodes.updateNodes anodes: ",nodes)
   try {
      const batch_size = 100;
      const updatedNodesDict = {};

      for (let i = 0; i < nodes.length; i += batch_size) {
         const batch = nodes.slice(i, i + batch_size);
         const updates = batch.map(node => {
            console.log("nodes.updateNodes updating node with id: ",node.id)

            const { id, ...updateData } = node;
            return prisma.node.update({
               where: { id: id },
               data: updateData
            });
         });

         const updatedNodesBatch = await Promise.all(updates);
         for (const node of updatedNodesBatch) {
            updatedNodesDict[node.id] = node;
         }
      }
      return updatedNodesDict
   } catch (error) {
      console.error("nodes.updateNodes error:", error)
   }
}

export async function redistributeNodeFrequencies(frequencyChange, nodeIdx) {
   console.log("nodes.redistributeNodeFrequencies: ", frequencyChange, nodeIdx)
   try {
      const nodesCount = await prisma.node.count()
      const numerator = frequencyChange
      const freqModifier = numerator / (nodesCount * nodesCount)

      const nodes = await prisma.node.findMany({
         orderBy: { idx: 'asc' }
      });
      const newFrequency = nodes[nodeIdx].frequency + (nodesCount * freqModifier)
      if (_.inRange(newFrequency, 0, 1)) {
         nodes[nodeIdx].frequency = newFrequency
         nodes.forEach((node, i) => {
            node.frequency -= freqModifier;
         })
         await prisma.$transaction(
            nodes.map((node) => prisma.node.update({
               where: { id: node.id },
               data: {
                  frequency: node.frequency,
               }
            }))
         );
         return nodes[nodeIdx]
      }
      return null
   } catch (error) {
      console.error("nodes.redistributeNodeFrequencies error:", error)
      return error
   }
}

async function updateNodeFrequencies(frequencyDelta) {
   const nodes = await prisma.node.findMany({
      orderBy: { idx: 'asc' }
   });
   nodes.forEach((node, i) => {
      node.frequency += frequencyDelta;
   })
   await prisma.$transaction(
      nodes.map((node) => prisma.node.update({
         where: { id: node.id },
         data: {
            frequency: node.frequency,
         }
      }))
   );
}

export async function getNodeByID(nodeID) {
   try {
      const node = await prisma.node.findUnique({
         where: { id: nodeID },
         // include: {tweets: true}
      })
      console.log("nodes.getNodeByID node:", node)
      return node
   } catch (error) {
      console.log("nodes.getNodeByID error:", error)
      return error
   }
}

export async function resetNodeFrequencies() {
   console.log("nodes.resetNodeFrequencies")
   try {
      const nodesCount = await prisma.node.count()
      const uniformFrequency = 1 / nodesCount
      const updatedNodes = await prisma.node.updateMany({
         data: {
            frequency: uniformFrequency
         }
      })
      return updatedNodes
   } catch (error) {
      console.log("nodes.resetNodeFrequencies error:", error)
   }
}

async function decrementRankingsGreaterThan(currNodeRanking) {
   await prisma.node.updateMany({
      where: {
         ranking: { gt: currNodeRanking }
      },
      data: {
         ranking: { decrement: 1 }
      }
   })
}

async function decrementIndexesGreaterThan(currNodeIndex) {
   await prisma.node.updateMany({
      where: {
         idx: { gt: currNodeIndex }
      },
      data: {
         idx: { decrement: 1 }
      }
   })
}

// async function getWeightedRandomNode() {
//    const randNum = Math.random(); // range of [0,1)
//    try {

//       const randNode = await prisma.node.findFirst({
//          where: {
//             frequencySigma: { lte: randNum },
//             frequencySigmaPlusFrequency: { gt: randNum },
//          }
//       });
//       if (!randNode) {
//          const firstNode = await prisma.node.findFirst();
//          return firstNode;
//       }
//       return randNode;
//    } catch (error) {
//       console.log("nodes.getWeightedRandomNode() error:", error);
//       return { error };
//    }
// }
async function getWeightedRandomNode() {
   // try {
   //    const nodes = await prisma.node.findMany({
   //       orderBy: { frequency: 'desc' }
   //    })
      // console.log("nodes.getWeightedRandomNode, node:", nodes[0].idx);
      // const redistNode = await redistributeNodeFrequencies(-1, nodes[0].idx)

      // return redistNode;
   // } catch (error) {
   //    console.log("nodes.getWeightedRandomNode, error:", error);
   //    return { error };
   // }
}

async function getNodeWithHighestIdxLowerThan(idx) {
   const node = await prisma.node.findFirst({
      where: {
         idx: { lt: idx },
      },
      orderBy: { idx: 'desc' },
   });
   return node;
}