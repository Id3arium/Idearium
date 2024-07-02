'use client';
import React, { useState, useCallback} from "react";
import { motion, useAnimation } from "framer-motion";
import NodeCardContent from '@/components/nodeCard/NodeCardContent'
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";

export default function LibraryNodeCard({ node }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const { actions, state } = useNodeCardLogic();   

    const rotationAnimation = useAnimation();
    
    const handleClick = async (e) => { 
        if (e.target.id === "library-node-card") { 
            await flipNodeCard(); 
        }
    }

    const flipNodeCard = useCallback(async () => {
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
        <motion.div
            id="library-node-card"
            className={`text-[#EEE] ml-1 mr-3 my-1 pointer-events-auto [box-shadow:0px_0px_4px_white] bg-[#22222250] hover:bg-[#22222230] rounded-md ${isHovered ? "backdrop-blur-sm" : "backdrop-blur-lg"}`}
            tabIndex='-1'
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
        </motion.div>
    );
}
