import { useEffect, useState, useCallback, useMemo } from "react";
import { useAnimation } from "framer-motion";
import { useAtomValue, useSetAtom, useAtom, atom } from 'jotai';
import * as Atoms from '@/lib/utils/atoms.js';
import useRandomNode from '@/lib/hooks/useRandomNode.js';
import {getNodeCardDuration} from '@/lib/utils/utils.js';

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
 
    const timerAnimation = useAnimation();
    const rotationAnimation = useAnimation();

    const targetTimerStyles = {
        opacity: .2,
        width: "0px",
        transition: {
            duration: getNodeCardDuration(currentNode),
            ease: "linear"
        }
    }

    useEffect(() => {
        if (isFlipped || isHovered) {
            timerAnimation.stop();
        } else {
            timerAnimation.start(targetTimerStyles);
        }
    }, [currentNode, isFlipped, isHovered, timerAnimation, targetTimerStyles]);

    useEffect(() => {
        console.log("NodeCard nodeID", currentNode?.id, "duration:", getNodeCardDuration(currentNode), "timeline idx:", currentTimelineIndex);
    }, [currentNode, currentTimelineIndex]);

    const handleClick = useCallback((e) => {
        if (e.target.id === "node-card") {
            const halfRotationDuration = .125;
            rotationAnimation.start({
                rotateY: 90,
                transition: { duration: halfRotationDuration },
                ease: "easeOut"
            }).then(() => {
                setIsFlipped(!isFlipped);
                rotationAnimation.start({
                    rotateY: 0,
                    transition: { duration: halfRotationDuration },
                    ease: "easeIn"
                });
            });
        }
    }, [rotationAnimation, isFlipped, setIsFlipped]);

    const restartTimerAnimation = useCallback(() => {
        console.log("NodeCard.restartTimerAnimation()")
        timerAnimation.stop()
        timerAnimation.set({ opacity: .05, width: "525px" });
        timerAnimation.start(targetTimerStyles);
    }, [timerAnimation, targetTimerStyles])

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
            handleClick, onNextCardCliked, onPrevCardClicked, setIsHovered, upDistributeFrequency, downDistributeFrequency, 
        },
        state: { 
            isHovered, isFlipped, timerAnimation, rotationAnimation, currentNode, currentTimelineIndex, nodeIDsTimelineLength, currentTimelineIndex, nodeIDsTimelineLength 
        }
    };
}