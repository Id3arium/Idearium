'use client';
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import NodeCardContent from '@/components/nodeCard/NodeCardContent'
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";

export default function LibraryNodeCard( {node} ) {
    const { actions, state } = useNodeCardLogic();    
    return (
        <MotionNodeCard
            id="node-card" $isHovered={state.isHovered} tabIndex='-1'
            onClick={e => { actions.handleClick(e) }}
            onMouseEnter={() => { actions.setIsHovered(true) }}
            onMouseLeave={() => { actions.setIsHovered(false) }}
            animate={state.rotationAnimation}
        >
            {/* <NodeCardControls
                node={state.currentNode}
                onNextCardCliked={actions.onNextCardCliked}
                onPrevCardClicked={actions.onPrevCardClicked}
                isFlipped={state.isFlipped}
                upDistributeFrequency={actions.upDistributeFrequency}
                downDistributeFrequency={actions.downDistributeFrequency}
            /> */}
            <NodeCardContent
                node={node}
                isFlipped={state.isFlipped}
                isHovered={state.isHovered}
                currentTimelineIndex={state.currentTimelineIndex}
                nodeIDsTimelineLength={state.nodeIDsTimelineLength}
            />
        </MotionNodeCard>
    );
}

const MotionNodeCard = styled(motion.div)`
    background: #00219708;
    border-radius: 5px;
    box-shadow: 0px 0px 4px #CCC;
    padding: 20px 30px 25px;
    width: 320px;
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