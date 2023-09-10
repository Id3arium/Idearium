import { Node } from '@/lib/interfaces/Node';
import { Note } from '@/lib/interfaces/Note';
import { nodesAtom } from "@/utils/atoms";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
// import { ObjectId } from 'bson';
let ObjectId;

const loadBson = async () => {
  if (!ObjectId) {
    const bsonModule = await import('bson');
    ObjectId = bsonModule.ObjectId;
  }
};

export function useCreateNode() {
   const nodes = useAtomValue(nodesAtom);
   const nodesCount = Object.keys(nodes).length

   const createNode = async (note: Note): Promise<Node> => {
      await loadBson();
  
      const frequency = 1 / (nodesCount + 1);
      const ranking = nodesCount + 1;
      const nodeID = new ObjectId().toHexString();
  
      const newNode: Node = {
         id: nodeID,
         created: new Date(),
         lastModified: new Date(),
         title: note.title,
         content: note.content,
         inspiration: note.inspiration,
         frequency: frequency,
         ranking: ranking,
      };

      console.log("createNode().newNode:", newNode);
      return newNode;
   };

   return createNode;
}