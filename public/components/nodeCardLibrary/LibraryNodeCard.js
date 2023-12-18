'use client';
import React, { useState, useCallback} from "react";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import NodeCardContent from '@/components/nodeCard/NodeCardContent'
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";

export default function LibraryNodeCard( {node} ) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const { actions, state } = useNodeCardLogic();   

    const rotationAnimation = useAnimation();
    
    const handleClick = async (e) => { if (e.target.id === "node-card") { await flipNodeCard(); } }

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
    
    return (
        <MotionNodeCard
            id="node-card" $isHovered={isHovered} tabIndex='-1'
            onClick={e => { handleClick(e) }}
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => { setIsHovered(false) }}
            animate={rotationAnimation}
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
                isFlipped={isFlipped}
                isHovered={isHovered}
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