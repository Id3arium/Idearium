import { Node } from '@/lib/interfaces/Node';
import { Note } from '@/lib/interfaces/Note';
import { nodesAtom } from "@/utils/atoms";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { ObjectId } from 'bson';
// import { v4 as uuidv4 } from 'uuid';

export function useCreateNode() {
  const nodes = useAtomValue(nodesAtom);
  const nodesCount = Object.keys(nodes).length

  const createNode = (note: Note): Node => {
    const frequency = 1 / (nodesCount + 1);
    const ranking = nodesCount + 1;

    const newNode: Node = {
      id: new ObjectId().toHexString(),
      created: new Date(),
      lastModified: new Date(),
      title: note.title,
      content: note.content,
      inspiration: note.inspiration,
      frequency: frequency,
      ranking: ranking,
    };

    console.log("New node:", newNode);

    return newNode;
  };

  return createNode;
}