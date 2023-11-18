import { useEffect, useState, useCallback, useMemo } from "react";
import { useAnimation } from "framer-motion";
import { useAtomValue, useSetAtom, useAtom, atom } from 'jotai';
import * as Atoms from '@/lib/utils/atoms.js';
import useRandomNode from '@/lib/hooks/useRandomNode.js';
import { getNodeCardDuration } from '@/lib/utils/utils.js';
import { signal, effect, computed } from '@preact/signals-react';

const isHoveredAtom = atom(false)
const isFlippedAtom = atom(false)

export const isHoveredSig = signal(false)
export const isFlippedSig = signal(false)

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

    const initialTimerStyles = useMemo(() => ({ opacity: .1, width: "525px" }), []);
    const targetTimerStyles = useMemo(() => ({
        opacity: .2,
        width: "0px",
        transition: {
            duration: getNodeCardDuration(currentNode),
            ease: "linear"
        }
    }), [currentNode]);

    // useEffect(() => {
    //     if (currentNode == null){ return }
        
    //     if (isFlippedSig.value || isHoveredSig.value) {
    //         timerAnimation.stop();
    //     } else {
    //         timerAnimation.start(targetTimerStyles);
    //     }
    // }, [currentNode, isFlipped, isHovered, timerAnimation, targetTimerStyles]);

    effect(() => {
        // if (currentNode == null){ return }
        
        if (isFlippedSig.value || isHoveredSig.value) {
            timerAnimation.stop();
        } else {
            timerAnimation.start(targetTimerStyles);
        }
    });

    effect(() => {
        console.log("isHoveredSig.value", isHoveredSig.value, "isFlippedSig.value:", isFlippedSig.value);
    })

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
        // setIsFlipped(!isFlipped);
        isFlippedSig.value = !isFlippedSig.value
        console.log("isFlippedSig",isFlippedSig.value)
        await rotationAnimation.start({
            rotateY: 0,
            transition: {
                duration: halfRotationDuration,
                ease: "easeIn"
            },
        });

    }, [rotationAnimation, isFlipped, setIsFlipped]);

    const restartTimerAnimation = useCallback(() => {
        console.log("NodeCard.restartTimerAnimation()")
        timerAnimation.stop()
        timerAnimation.set(initialTimerStyles);
        timerAnimation.start(targetTimerStyles);
    }, [timerAnimation, initialTimerStyles, targetTimerStyles])

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
            isHovered, isFlipped, timerAnimation, rotationAnimation, currentNode, currentTimelineIndex, nodeIDsTimelineLength, currentTimelineIndex, nodeIDsTimelineLength, isHoveredSig, isFlippedSig,
        }
    };
}