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

    const removeNode = useSetAtom(Atoms.removeNodeAtom)

    useEffect(() => {
        console.log("NodeCard nodeID", currentNode?.id, "duration:", getNodeCardDuration(currentNode), "timeline idx:", currentTimelineIndex);
    }, [currentNode, currentTimelineIndex]);

    const onNextCardClicked = useCallback(() => {
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

    const onEditStarted = useCallback(() => {
        setEditedNode({ ...currentNode });
    }, [currentNode]);

    const onEditInputChanged = useCallback((name, value) => {
        setEditedNode(prev => ({ ...prev, [name]: value }));
    }, []);

    const onEditConfirmed = useCallback(() => {
        if (editedNode) {
            updateNode(editedNode);
            setEditedNode(null);
        }
    }, [editedNode, updateNode]);

    const onEditCancelled = useCallback(() => {
        setEditedNode(null);
    }, []);

    // const onTimerAnimationStarted = useCallback((duration) => {
    //     animate(timerAnimationProgress, 1, { duration });
    // }, [timerAnimationProgress]);

    // const onTimerAnimationPaused = useCallback(() => {
    //     timerAnimationProgress.stop();
    // }, [timerAnimationProgress]);

    // const onTimerAnimationRestarted = useCallback((duration) => {
    //     timerAnimationProgress.set(0);
    //     onTimerAnimationStarted(duration);
    // }, [timerAnimationProgress, onTimerAnimationStarted]);

    return {
        actions: {
            onNextCardClicked,
            onPrevCardClicked,
            upDistributeFrequency,
            downDistributeFrequency,
            removeNode,
            onEditStarted,
            onEditInputChanged,
            onEditConfirmed,
            onEditCancelled,
            // onTimerAnimationStarted,
            // onTimerAnimationPaused,
            // onTimerAnimationRestarted
        },
        state: {
            currentNode,
            editedNode,
            currentTimelineIndex,
            nodeIDsTimelineLength,
            timerAnimationProgress
        }
    };
}
