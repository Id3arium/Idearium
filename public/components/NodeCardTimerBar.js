import { motion } from "framer-motion";
import styled from "styled-components";

export default function NodeCardTimerBar({ isFlipped, isHovered, animation, initialStyles, onNextCardCliked }) {
    return (
        <StyledMotionTimerBar className="timer-bar"
            $isVisible={!isFlipped}
            $isHovered={isHovered}
            animate={animation}
            initial={initialStyles}
            onUpdate={(animationDef) => {
                if (animationDef.width == "0px") {
                    console.log("animationDef", animationDef);
                    onNextCardCliked();
                }
            }} 
        />
    )
}

const StyledMotionTimerBar = styled(motion.div)`
    width: 100%;
    opacity: .15;
    position: absolute;
    border-radius: 2px;
    filter: ${props => props.$isVisible ? "none" : (props.$isHovered ? "blur(3px)" : "blur(9px)")};
    pointer-events: none;
    height: 3px;
    margin: 0 auto;
    background-color: white;

    top: 100%; 
    left: 50%; 
    transform: translate(-50%, -3.5px); 
    transform-origin: center center;
`