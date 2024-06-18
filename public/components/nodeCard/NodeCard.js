import React, { useState, useEffect, useCallback } from "react";
import { animate, useAnimation, useMotionValue } from "framer-motion";
import { motion } from "framer-motion";
import NodeCardControls from "./NodeCardControls.js";
import NodeCardContent from "./NodeCardContent.js";
import NodeCardTimerBar from "./NodeCardTimerBar.js";
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";
import { getNodeCardDuration } from "@/lib/utils/utils.js";

export default function NodeCard() {
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const { actions, state } = useNodeCardLogic();

    const rotationAnimation = useAnimation();
    const timerAnimationProgress = useMotionValue(0);

    const startTimerAnimation = useCallback(
        (currNodeDuration) => {
            const duration = currNodeDuration;
            animate(timerAnimationProgress, 1, { duration: duration });
        },
        [timerAnimationProgress]
    );

    const pauseTimerAnimation = useCallback(() => {
        timerAnimationProgress.destroy();
    }, [timerAnimationProgress]);

    const restartTimerAnimation = useCallback(
        (duration) => {
            timerAnimationProgress.set(0);
            startTimerAnimation(duration);
        },
        [timerAnimationProgress, startTimerAnimation]
    );

    useEffect(() => {
        if (state.currentNode == null) return;
        restartTimerAnimation(getNodeCardDuration(state.currentNode));
    }, [state.currentNode, restartTimerAnimation]);

    useEffect(() => {
        if (state.currentNode == null) return;
        var shouldPauseTimerBar = isFlipped || isHovered;
        if (shouldPauseTimerBar && timerAnimationProgress.isAnimating()) {
            pauseTimerAnimation();
        }
        if (!shouldPauseTimerBar && !timerAnimationProgress.isAnimating()) {
            startTimerAnimation(getNodeCardDuration(state.currentNode));
        }
    }, [
        state.currentNode,
        isHovered,
        isFlipped,
        timerAnimationProgress,
        pauseTimerAnimation,
        startTimerAnimation,
    ]);

    const flipNodeCardAnimation = useCallback(async () => {
        const halfRotationDuration = 0.1;
        await rotationAnimation.start({
            rotateY: 90,
            transition: {
                duration: halfRotationDuration,
                ease: "easeOut",
            },
        });
        setIsFlipped(!isFlipped);
        await rotationAnimation.start({
            rotateY: 0,
            transition: {
                duration: halfRotationDuration,
                ease: "easeIn",
            },
        });
    }, [rotationAnimation, isFlipped, setIsFlipped]);

    const handleClick = async (e) => {
        if (e.target.id === "node-card") {
            await flipNodeCardAnimation();
        }
    };

    const handleMouseEnter = async (e) => {
        setIsHovered(true);
    };
    const handleMouseLeave = async (e) => {
        setIsHovered(false);
    };

    return (
        <div
            id="node-card-container"
            className="pointer-events-auto"
            tabIndex="-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                id="node-card"
                className={`relative text-[#EEE] w-[525px] rounded-md 
            [box-shadow:0px_0px_4px_white] bg-[#22222250] hover:bg-[#22222230]
            ${isHovered ? "backdrop-blur-sm" : "backdrop-blur-lg"}`}
                
                onClick={(e) => {
                    handleClick(e);
                }}
                animate={rotationAnimation}
            >
                <NodeCardTimerBar
                    isFlipped={isFlipped}
                    isHovered={isHovered}
                    progress={timerAnimationProgress}
                    onNextCardCliked={actions.onNextCardCliked}
                />
                <NodeCardContent
                    node={state.currentNode}
                    isFlipped={isFlipped}
                    isHovered={isHovered}
                    currentTimelineIndex={state.currentTimelineIndex}
                    nodeIDsTimelineLength={state.nodeIDsTimelineLength}
                />
            </motion.div>
            <NodeCardControls
                node={state.currentNode}
                actions={actions}
                isFlipped={isFlipped}
                isHovered={isHovered}
            />
        </div>
    );
}
