'use client';
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as Atoms from '@/lib/utils/atoms.js';
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeys } from 'react-hotkeys'
import { PositionedComponent } from "./PositionedComponent.js";
import useRandomNode from '@/lib/hooks/useRandomNode.js';
import NodeCardControls from './NodeCardControls.js'
import NodeCardContent from './NodeCardContent.js'
import NodeCardTimerBar from './NodeCardTimerBar.js'
import _ from 'lodash'

const isHoveredAtom = atom(false)
const isFlippedAtom = atom(false)

export default function NodeCard() {
    const wordsPerMinute = 60
    const getRandomNode = useRandomNode();

    const [duration, setDuration] = useState(0);
    const [isHovered, setIsHovered] = useAtom(isHoveredAtom)
    const [isFlipped, setIsFlipped] = useAtom(isFlippedAtom)

    const currentNode = useAtomValue(Atoms.currentNodeAtom)
    const currentTimelineIndex = useAtomValue(Atoms.currentTimelineIndexAtom)
    const nodeIDsTimelineLength = useAtomValue(Atoms.nodeTimelineLengthAtom)

    const onNextNodeCard = useSetAtom(Atoms.onNextNodeAtom)
    const onPrevNodeCard = useSetAtom(Atoms.onPrevNodeAtom)

    const removeNode = useSetAtom(Atoms.removeNodeAtom)
    const resetNodeFrequencies = useSetAtom(Atoms.resetNodeFrequenciesAtom)

    const upDistributeFrequency = useSetAtom(Atoms.upDistributeFrequencyAtom)
    const downDistributeFrequency = useSetAtom(Atoms.downDistributeFrequencyAtom)

    const timerAnimation = useAnimation()
    const initialStyles = {
        opacity: .05,
        width: "525px",
    }
    const targetStyles = useMemo(() => ({
        opacity: .2,
        width: "0px",
        transition: {
            duration: Math.max(5, duration),
            ease: "linear"
        }
    }), [duration]);

    const getCurrentNodeCardDuration = useCallback((wordsPerMinute = 60) => {
        let minTime = 3
        if (currentNode == null) { return 0 }
        const wordCount = currentNode?.title.split(' ').length + currentNode?.content.split(' ').length
        const nonSpaceCharCount = currentNode?.title.length + currentNode?.content.length - (wordCount - 1)
        const wordCharCount = nonSpaceCharCount / wordCount

        const averageWordCharCount = 5.1
        let readingTimeScaler = wordCharCount / averageWordCharCount
        const readingSpeedInMinutes = readingTimeScaler * wordCount * wordsPerMinute
        const readingSpeedInSeconds = readingSpeedInMinutes / 60
        // console.log("getCurrentNodeCardDuration readingSpeedInSeconds", readingSpeedInSeconds )
        return _.round(Math.max(readingSpeedInSeconds, minTime), 2)
    }, [currentNode]);

    useEffect(() => {
        if (isFlipped || isHovered) {
            timerAnimation.stop()
        } else {
            timerAnimation.start(targetStyles)
        }
    }, [isFlipped, isHovered, timerAnimation, targetStyles])

    useEffect(() => {
        let currCardDuration = getCurrentNodeCardDuration(wordsPerMinute)
        setDuration(currCardDuration);
        console.log("NodeCard nodeID", currentNode?.id, "duration:", currCardDuration, "timleine idx:", currentTimelineIndex)
    }, [currentNode, currentTimelineIndex, getCurrentNodeCardDuration]);

    const handleClick = (e) => { if (e.target.id == "node-card") { flipNodeCardOver() } }

    const rotationAnimation = useAnimation()
    function flipNodeCardOver() {
        const halfRotationDuration = .125
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

    function restartTimerAnimation() {
        console.log("NodeCard.restartTimerAnimation()")
        timerAnimation.stop()
        timerAnimation.set(initialStyles)
        timerAnimation.start(targetStyles)
    }

    function onNextCardCliked() {
        console.log("NodeCard.onNextCardCliked()")
        if (currentNode == null) { return }
        let randNode;
        do {
            randNode = getRandomNode();
        } while (currentNode && randNode.id === currentNode.id);

        onNextNodeCard(randNode)
        restartTimerAnimation()
    }

    function onPrevCardClicked() {
        console.log("NodeCard.onPrevCardClicked()")
        onPrevNodeCard()
        restartTimerAnimation()
    }

    let controls = <NodeCardControls
        currentNode={currentNode}
        onNextCardCliked={onNextCardCliked}
        onPrevCardClicked={onPrevCardClicked}
        isFlipped={isFlipped}
        upDistributeFrequency={upDistributeFrequency}
        downDistributeFrequency={downDistributeFrequency}
    />

    let CardContent = <NodeCardContent
        currentNode={currentNode}
        isFlipped={isFlipped}
        isHovered={isHovered}
        currentTimelineIndex={currentTimelineIndex}
        nodeIDsTimelineLength={nodeIDsTimelineLength}
    />

    let timerBar = <NodeCardTimerBar
        isFlipped={isFlipped}
        isHovered={isHovered}
        onNextCardCliked={onNextCardCliked}
        animation={timerAnimation}
        initialStyles={initialStyles}
    />

    return (
        <PositionedComponent
            id="positioned-component"
            position="middle-center">
            <StyledMotionNodeCard
                id="node-card" $isHovered={isHovered} tabIndex='-1'
                onClick={e => { handleClick(e) }}
                onMouseEnter={() => { setIsHovered(true) }}
                onMouseLeave={() => { setIsHovered(false) }}
                animate={rotationAnimation}
            >
                {timerBar}
                {controls}
                {CardContent}
            </StyledMotionNodeCard>
        </PositionedComponent>
    );
}

const StyledMotionNodeCard = styled(motion.div)`
    background: #00219708;
    border-radius: 5px;
    box-shadow: 0px 0px 4px #CCC;
    padding: 20px 30px 25px;
    width: 525px;
    margin: 4px;
    position: relative;
    color: #EEE;
    backdrop-filter: ${props => props.$isHovered ? "blur(4px)" : "blur(15px)"};
    background-color: #22222260;
    overflow: visible;

    :hover {
        background-color: #22222230;
    }

    :hover > #card-controls {
        display: block;
    }
        
    h1 {
        text-align: center;
        font-size: 1.2em;
        margin: 0px 15px 20px;
    }

    p {
        margin: auto;
        font-size: 1.15em;
    }  
`;


