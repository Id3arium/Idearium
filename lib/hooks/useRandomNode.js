import { useAtom, useAtomValue} from 'jotai';
import { nodesAtom,  } from '@/utils/atoms.js';
import { useCallback } from 'react';
import _ from 'lodash';

export default function useRandomNode() {
    const nodes = useAtomValue(nodesAtom)

    return useCallback(() => {
        const nodesList = Object.values(nodes)
        if (nodesList.length === 0) { 
            console.log("nextRandomNodeAtom expected non-empty list of nodes") 
            return null;
        }
        if (nodesList.length === 1) { 
            console.log("nextRandomNodeAtom returning the only node") 
            return nodesList[0];
        }

        const randNum = Math.random(); // range of [0,1)
        let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 
        // nodes.forEach(node => console.log(node))
        for (const node of nodesList) {
            const randNumIsGTEFreqSigma = randNum >= frequencySigma
            const randNumIsLTFreqSigmaPlusNodeFreq = randNum < (frequencySigma + node.frequency)
            let isInFrequencyRange = randNumIsGTEFreqSigma && randNumIsLTFreqSigmaPlusNodeFreq
            //likelyhood of randNum being inside the range is == to the nodes frequency
            if (isInFrequencyRange) {
                return node
            } else {
                frequencySigma += node.frequency
            }
        }
        console.log("nextRandomNodeAtom returnning last node")
        return _.last(nodesList);
    }, [nodes]);
}