import prisma from '.'
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
      console.log("nodes.getNodes error:", error)
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
      console.log("nodes.getNextRandomNode:", randNode.idx)
      return randNode
   } catch (error) {
      console.log("nodes.getNextRandomNode:", error)
      return error
   }
}

export async function createNode(nodeData) {
   try {
      const nodesCount = await prisma.node.count();
      nodeData.idx = nodesCount
      nodeData.ranking = nodesCount + 1
      nodeData.frequency = 1 / (nodesCount + 1)

      const frequencyDelta = nodeData.frequency / nodesCount
      await updateNodeFrequencies(-frequencyDelta)

      const prevNode = await getNodeWithHighestIdxLowerThan(nodesCount)
      // nodeData.frequencySigma = prevNode ? prevNode.frequencySigmaPlusFrequency : 0
      // nodeData.frequencySigmaPlusFrequency = nodeData.frequency + nodeData.frequencySigma

      const createdNode = await prisma.node.create({ data: nodeData })
      return createdNode
   } catch (error) {
      console.log("nodes.createNode error:", error);
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
         const nodesCount = await prisma.node.count()
         const frequencyDelta = (deletedNode.frequency / nodesCount)

         await decrementIndexesGreaterThan(deletedNode.idx)
         await decrementRankingsGreaterThan(deletedNode.ranking)
         await updateNodeFrequencies(frequencyDelta);
      }
      return deletedNode
   } catch (error) {
      console.log("nodes.deleteNode error:", error)
      return error
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
      console.log("nodes.redistributeNodeFrequencies error:", error)
      return error
   }
}

async function updateNodeFrequencies(frequencyDelta) {
   const nodes = await prisma.node.findMany({
      orderBy: { idx: 'asc' }
   });
   nodes.forEach((node, i) => {
      node.frequency += frequencyDelta;
      // node.frequencySigma = i > 0 ? nodes[i - 1].frequencySigmaPlusFrequency : 0;
      // node.frequencySigmaPlusFrequency = node.frequency + node.frequencySigma;
   })
   await prisma.$transaction(
      nodes.map((node) => prisma.node.update({
         where: { id: node.id },
         data: {
            frequency: node.frequency,
            // frequencySigma: node.frequencySigma,
            // frequencySigmaPlusFrequency: node.frequencySigmaPlusFrequency
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
   try {
      const nodes = await prisma.node.findMany({
         orderBy: { frequency: 'desc' }
      })
      console.log("nodes.getWeightedRandomNode, node:", nodes[0].idx);
      const redistNode = await redistributeNodeFrequencies(-1, nodes[0].idx)
      
      return redistNode;
   } catch (error) {
      console.log("nodes.getWeightedRandomNode, error:", error);
      return { error };
   }
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