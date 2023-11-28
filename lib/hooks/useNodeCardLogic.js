import { useEffect, useCallback} from "react";
import { animate, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useAtomValue, useSetAtom, useAtom, atom } from 'jotai';
import * as Atoms from '@/lib/utils/atoms.js';
import useRandomNode from '@/lib/hooks/useRandomNode.js';
import { getNodeCardDuration } from '@/lib/utils/utils.js';

export default function useNodeCardLogic() {
    const getRandomNode = useRandomNode();

    const currentNode = useAtomValue(Atoms.currentNodeAtom)
    const currentTimelineIndex = useAtomValue(Atoms.currentTimelineIndexAtom)
    const nodeIDsTimelineLength = useAtomValue(Atoms.nodeTimelineLengthAtom)

    const onNextNodeCard = useSetAtom(Atoms.onNextNodeAtom)
    const onPrevNodeCard = useSetAtom(Atoms.onPrevNodeAtom)

    const upDistributeFrequency = useSetAtom(Atoms.upDistributeFrequencyAtom)
    const downDistributeFrequency = useSetAtom(Atoms.downDistributeFrequencyAtom)

    useEffect(() => {
        console.log("NodeCard nodeID", currentNode?.id, "duration:", getNodeCardDuration(currentNode), "timeline idx:", currentTimelineIndex);
    }, [currentNode, currentTimelineIndex]);

    const onNextCardCliked = useCallback(() => {
        if (currentNode == null) return;
        let randNode;
        do {
            randNode = getRandomNode();
        } while (currentNode && randNode.id === currentNode.id);

        onNextNodeCard(randNode);
    }, [currentNode, getRandomNode, onNextNodeCard]);

    const onPrevCardClicked = useCallback(() => {
        onPrevNodeCard();
    }, [onPrevNodeCard]);

    return {
        actions: {
            onNextCardCliked, onPrevCardClicked, upDistributeFrequency, downDistributeFrequency,
        },
        state: {
            currentNode, currentTimelineIndex, nodeIDsTimelineLength, currentTimelineIndex, nodeIDsTimelineLength
        }
    };
}