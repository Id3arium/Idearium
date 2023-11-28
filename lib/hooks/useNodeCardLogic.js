import { useEffect, useState, useCallback, useMemo } from "react";
import { animate, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useAtomValue, useSetAtom, useAtom, atom } from 'jotai';
import * as Atoms from '@/lib/utils/atoms.js';
import useRandomNode from '@/lib/hooks/useRandomNode.js';
import { getNodeCardDuration } from '@/lib/utils/utils.js';

const isHoveredAtom = atom(false)
const isFlippedAtom = atom(false)

export default function useNodeCardLogic() {
    const getRandomNode = useRandomNode();

    const [isHovered, setIsHovered] = useAtom(isHoveredAtom)
    const [isFlipped, setIsFlipped] = useAtom(isFlippedAtom)

    const currentNode = useAtomValue(Atoms.currentNodeAtom)
    const currentTimelineIndex = useAtomValue(Atoms.currentTimelineIndexAtom)
    const nodeIDsTimelineLength = useAtomValue(Atoms.nodeTimelineLengthAtom)

    const onNextNodeCard = useSetAtom(Atoms.onNextNodeAtom)
    const onPrevNodeCard = useSetAtom(Atoms.onPrevNodeAtom)

    const upDistributeFrequency = useSetAtom(Atoms.upDistributeFrequencyAtom)
    const downDistributeFrequency = useSetAtom(Atoms.downDistributeFrequencyAtom)

    const rotationAnimation = useAnimation();

    const timerAnimationProgress = useMotionValue(0); 

    const startTimerAnimation = useCallback((currNodeDuration) => {
        const duration =  currNodeDuration
        animate(timerAnimationProgress, 1, { duration: duration })
    }, [timerAnimationProgress])

    const pauseTimerAnimation = useCallback(() => {
        timerAnimationProgress.destroy();
    }, [timerAnimationProgress])

    const restartTimerAnimation = useCallback((duration) => {
        timerAnimationProgress.set(0)
        startTimerAnimation(duration)
    }, [timerAnimationProgress, startTimerAnimation]);

    useEffect(() => {
        if (currentNode == null){ return }
        restartTimerAnimation(getNodeCardDuration(currentNode));
    }, [currentNode, restartTimerAnimation]);

    useEffect(() => {
        if (currentNode == null){ return }
        var shouldPauseTimerBar = isFlipped || isHovered
        if (shouldPauseTimerBar && timerAnimationProgress.isAnimating()) {
            pauseTimerAnimation()
        } 
        if(!shouldPauseTimerBar && !timerAnimationProgress.isAnimating()){
            startTimerAnimation(getNodeCardDuration(currentNode))
        }
    }, [currentNode, isHovered, isFlipped, timerAnimationProgress, pauseTimerAnimation, startTimerAnimation]);

    useEffect(() => {
        console.log("NodeCard nodeID", currentNode?.id, "duration:", getNodeCardDuration(currentNode), "timeline idx:", currentTimelineIndex);
    }, [currentNode, currentTimelineIndex]);

    const handleClick = async (e) => { if (e.target.id === "node-card") { await flipNodeCard(); } }

    const flipNodeCard = useCallback(async () => {
        const halfRotationDuration = .1;
        await rotationAnimation.start({
            rotateY: 90,
            transition: {
                duration: halfRotationDuration,
                ease: "easeOut"
            },
        })
        setIsFlipped(!isFlipped);
        await rotationAnimation.start({
            rotateY: 0,
            transition: {
                duration: halfRotationDuration,
                ease: "easeIn"
            },
        });

    }, [rotationAnimation, isFlipped, setIsFlipped]);

    const onNextCardCliked = useCallback(() => {
        if (currentNode == null) return;
        let randNode;
        do {
            randNode = getRandomNode();
        } while (currentNode && randNode.id === currentNode.id);

        onNextNodeCard(randNode);
        restartTimerAnimation();
    }, [currentNode, getRandomNode, onNextNodeCard, restartTimerAnimation]);

    const onPrevCardClicked = useCallback(() => {
        onPrevNodeCard();
        restartTimerAnimation();
    }, [onPrevNodeCard, restartTimerAnimation]);

    return {
        actions: {
            handleClick, flipNodeCard, onNextCardCliked, onPrevCardClicked, setIsHovered, upDistributeFrequency, downDistributeFrequency,
        },
        state: {
            isHovered, isFlipped, timerAnimationProgress, rotationAnimation, currentNode, currentTimelineIndex, nodeIDsTimelineLength, currentTimelineIndex, nodeIDsTimelineLength
        }
    };
}