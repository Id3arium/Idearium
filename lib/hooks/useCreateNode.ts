import { Node } from '@/lib/interfaces/Node';
import { Note } from '@/lib/interfaces/Note';
import { nodesCountAtom, redistributeFrequenciesAtom } from "@/utils/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { v4 as uuidv4 } from 'uuid';

export function useCreateNode() {
  const nodesCount = useAtomValue(nodesCountAtom);

  const createNode = (note: Note): Node => {
    const id = uuidv4();
    const idx = nodesCount;
    const frequency = 1 / (nodesCount + 1);
    const ranking = nodesCount + 1;

    const newNode: Node = {
      id: id,
      idx: idx,
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