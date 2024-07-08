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
    const [isEditing, setIsEditing] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [editedNode, setEditedNode] = useState(null);
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
        var shouldPauseTimerBar = isFlipped || isHovered || isEditing || isRemoving;
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
        isEditing,
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
                ease: "linear",
            },
        });
        setIsFlipped(!isFlipped);
        await rotationAnimation.start({
            rotateY: 0,
            transition: {
                duration: halfRotationDuration,
                ease: "linear",
            },
        });
    }, [rotationAnimation, isFlipped, setIsFlipped]);

    const onClick = async (e) => {
        if (e.target.id === "node-card" && !isEditing) {
            await flipNodeCardAnimation();
        }
    };
    
    const onCardContentInputChange = (e) => {
        const { name, value } = e.target;
        setEditedNode((prev) => ({ ...prev, [name]: value }));
    };

    const onMouseEnter = async (e) => { setIsHovered(true); };
    const onMouseLeave = async (e) => { setIsHovered(false); };

    const onEditCardClicked = () => {
        setIsEditing(true);
        setEditedNode({ ...state.currentNode });
    };

    const onRemoveCardClicked = () => {
        setIsEditing(true);
        () => actions.removeNode(node);
    };

    const onConfirmEditClicked = () => {
        actions.updateNode(editedNode);
        setIsEditing(false);
    };

    const onCancelEditClicked = () => {
        setEditedNode(null);
        setIsEditing(false);
    };

    const startEditing = useCallback(() => {
        setIsEditing(true);
        setEditedNode({ ...state.currentNode });
    }, [state.currentNode]);

    const startRemoving = useCallback(() => {
        setIsRemoving(true);
    }, []);

    const confirmAction = useCallback(() => {
        if (isEditing && editedNode) {
            actions.updateNode(editedNode);
            setIsEditing(false);
            setEditedNode(null);
        } else if (isRemoving) {
            actions.removeNode(state.currentNode);
            setIsRemoving(false);
        }
    }, [isEditing, isRemoving, editedNode, actions, state.currentNode]);

    const cancelAction = useCallback(() => {
        if (isEditing) {
            setIsEditing(false);
            setEditedNode(null);
        } else if (isRemoving) {
            setIsRemoving(false);
        }
    }, [isEditing, isRemoving]);

    return (
        <div
            id="node-card-container"
            className="pointer-events-auto"
            tabIndex="-1"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <motion.div
                id="node-card"
                className={`relative text-[#E0E0E0] rounded-md [box-shadow:0px_0px_6px_white] overflow-hidden transition-all z-10
                ${isFlipped || isHovered 
                    ? "backdrop-blur-sm bg-clear" : "backdrop-blur-lg bg-[#22222240]"
                }`}
                onClick={onClick}
                animate={rotationAnimation}
            >
                <NodeCardTimerBar
                    isFlipped={isFlipped}
                    isHovered={isHovered}
                    isEditing={isEditing}
                    progress={timerAnimationProgress}
                    onNextCardClicked={actions.onNextCardClicked}
                />
                <NodeCardContent
                    node={state.currentNode}
                    isFlipped={isFlipped}
                    isHovered={isHovered}
                    isEditing={isEditing}
                    currentTimelineIndex={state.currentTimelineIndex}
                    nodeIDsTimelineLength={state.nodeIDsTimelineLength}
                />
                <NodeCardControls
                    node={state.currentNode}
                    actions={actions}
                    isFlipped={isFlipped}
                    isHovered={isHovered}
                    isEditing={isEditing}
                    isRemoving={isRemoving}
                    onEditClicked={startEditing}
                    onRemoveClicked={startRemoving}
                    onConfirmClicked={confirmAction}
                    onCancelClicked={cancelAction}
                />
            </motion.div>
        </div>
    );
}
