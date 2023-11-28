'use client';
import React, { useState, useEffect, useCallback} from "react";
import { animate, useAnimation, useMotionValue, useTransform } from "framer-motion";
import styled from "styled-components";
import { motion } from "framer-motion";
import { PositionedComponent } from "../PositionedComponent.js";
import NodeCardControls from './NodeCardControls.js';
import NodeCardContent from './NodeCardContent.js';
import NodeCardTimerBar from './NodeCardTimerBar.js';
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";
import { getNodeCardDuration } from '@/lib/utils/utils.js';

export default function NodeCard() {
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const { actions, state } = useNodeCardLogic();    

    const rotationAnimation = useAnimation();
    const timerAnimationProgress = useMotionValue(0); 

    const startTimerAnimation = useCallback(
    (currNodeDuration) => {
        const duration =  currNodeDuration;
        animate(timerAnimationProgress, 1, { duration: duration });
    }, [timerAnimationProgress])

    const pauseTimerAnimation = useCallback(
    () => {
        timerAnimationProgress.destroy();
    }, [timerAnimationProgress])

    const restartTimerAnimation = useCallback(
    (duration) => {
        timerAnimationProgress.set(0);
        startTimerAnimation(duration);
    }, [timerAnimationProgress, startTimerAnimation]);

    useEffect( 
    () => {
        if (state.currentNode == null) return
        restartTimerAnimation(getNodeCardDuration(state.currentNode));
    }, [state.currentNode, restartTimerAnimation]);

    useEffect(
    () => {
        if (state.currentNode == null) return; 
        var shouldPauseTimerBar = isFlipped || isHovered;
        if (shouldPauseTimerBar && timerAnimationProgress.isAnimating()) {
            pauseTimerAnimation();
        } 
        if(!shouldPauseTimerBar && !timerAnimationProgress.isAnimating()){
            startTimerAnimation(getNodeCardDuration(state.currentNode));
        }
    }, [state.currentNode, isHovered, isFlipped, timerAnimationProgress, pauseTimerAnimation, startTimerAnimation]);

    const flipNodeCard = useCallback(
    async () => {
        const halfRotationDuration = .1;
        await rotationAnimation.start({
            rotateY: 90,
            transition: {
                duration: halfRotationDuration,
                ease: "easeOut"
            },
        });
        setIsFlipped(!isFlipped);
        await rotationAnimation.start({
            rotateY: 0,
            transition: {
                duration: halfRotationDuration,
                ease: "easeIn"
            },
        });
    }, [rotationAnimation, isFlipped, setIsFlipped]);

    const handleClick = async (e) => { if (e.target.id === "node-card") { await flipNodeCard(); } }

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
                <NodeCardTimerBar
                    isFlipped={isFlipped}
                    isHovered={isHovered}
                    progress={timerAnimationProgress}
                    onNextCardCliked={actions.onNextCardCliked}
                />
                <NodeCardControls
                    node={state.currentNode}
                    onNextCardCliked={actions.onNextCardCliked}
                    onPrevCardClicked={actions.onPrevCardClicked}
                    isFlipped={isFlipped}
                    upDistributeFrequency={actions.upDistributeFrequency}
                    downDistributeFrequency={actions.downDistributeFrequency}
                />
                <NodeCardContent
                    node={state.currentNode}
                    isFlipped={isFlipped}
                    isHovered={isHovered}
                    currentTimelineIndex={state.currentTimelineIndex}
                    nodeIDsTimelineLength={state.nodeIDsTimelineLength}
                />
            </StyledMotionNodeCard>
        </PositionedComponent>
    );
}

const StyledMotionNodeCard = styled(motion.div)`
    background: #00219708;
    border-radius: 5px;
    box-shadow: 0px 0px 4px #CCC;
    padding: 20px 30px 25px;
    max-width: 525px;
    margin: 4px;
    position: relative;
    color: #EEE;
    backdrop-filter: ${props => props.$isHovered ? "blur(4px)" : "blur(15px)"};
    background-color: #22222250;
    overflow: visible;

    :hover {
        background-color: #22222230;
    }

    :hover > #card-controls {
        display: block;
    }
`;