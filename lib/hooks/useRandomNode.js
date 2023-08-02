import { useAtom } from 'jotai';
import { nodesAtom } from '@/utils/atoms.js';
import { useCallback } from 'react';


export default function useRandomNode() {
    const [nodes] = useAtom(nodesAtom);

    return useCallback(() => {
        if (nodes.length === 0) { 
            console.log("nextRandomNodeAtom expected non-empty list of nodes") 
            return null;
        }

        const randNum = Math.random(); // range of [0,1)
        let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 
        // nodes.forEach(node => console.log(node))
        for (let i = 0; i < nodes.length; i++) {
            const randNumIsGTEFreqSigma = randNum >= frequencySigma
            const randNumIsLTFreqSigmaPlusNodeFreq = randNum < (frequencySigma + nodes[i].frequency)
            let isInFrequencyRange = randNumIsGTEFreqSigma && randNumIsLTFreqSigmaPlusNodeFreq
            //likelyhood of randNum being inside the range is == to the nodes frequency
            if (isInFrequencyRange) {
                return nodes[i]
            } else {
                frequencySigma += nodes[i].frequency
            }
        }
        console.log("nextRandomNodeAtom returnning last node")
        return nodes[nodes.length - 1];
    }, [nodes]);
}