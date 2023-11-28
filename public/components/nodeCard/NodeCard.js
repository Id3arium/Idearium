'use client';
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { HotKeys } from 'react-hotkeys'
import { PositionedComponent } from "../PositionedComponent.js";
import NodeCardControls from './NodeCardControls.js'
import NodeCardContent from './NodeCardContent.js'
import NodeCardTimerBar from './NodeCardTimerBar.js'
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";

export default function NodeCard() {
    const { actions, state } = useNodeCardLogic();    

    return (
        <PositionedComponent
            id="positioned-component"
            position="middle-center">
            <StyledMotionNodeCard
                id="node-card" $isHovered={state.isHovered} tabIndex='-1'
                onClick={e => { actions.handleClick(e) }}
                onMouseEnter={() => { actions.setIsHovered(true) }}
                onMouseLeave={() => { actions.setIsHovered(false) }}
                animate={state.rotationAnimation}
            >
                <NodeCardTimerBar
                    isFlipped={state.isFlipped}
                    isHovered={state.isHovered}
                    progress={state.timerAnimationProgress}
                    onNextCardCliked={actions.onNextCardCliked}
                    animation={state.timerAnimation}
                    initialStyles={state.initialStyles}
                />
                <NodeCardControls
                    node={state.currentNode}
                    onNextCardCliked={actions.onNextCardCliked}
                    onPrevCardClicked={actions.onPrevCardClicked}
                    isFlipped={state.isFlipped}
                    upDistributeFrequency={actions.upDistributeFrequency}
                    downDistributeFrequency={actions.downDistributeFrequency}
                />
                <NodeCardContent
                    node={state.currentNode}
                    isFlipped={state.isFlipped}
                    isHovered={state.isHovered}
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