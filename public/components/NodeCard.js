'use client';
import React, { useEffect, useRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { motion, useAnimationControls } from "framer-motion";
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentNodeAtom, currentTimelineIndexAtom, nodeIDsTimelineLengthAtom, removeNodeAtom } from '@/public/atoms.js';
import { nodesAtom, onPrevNodeAtom, onNextNodeAtom, decreaseNodeFrquencyAtom, increaseNodeFrquencyAtom } from '@/public/atoms.js';
import { useHotkeys } from "react-hotkeys-hook";

const isHoveredAtom = atom(false)
const frontSideVisibleAtom = atom(true)


export default function NodeCard(props) {
    const [isHovered, setIsHovered] = useAtom(isHoveredAtom)
    const [frontSideVisible, setFrontSideVisible] = useAtom(frontSideVisibleAtom)

    const nodes = useAtomValue(nodesAtom)
    const currentNode = useAtomValue(currentNodeAtom)
    const currentTimelineIndex = useAtomValue(currentTimelineIndexAtom)
    const nodeIDsTimelineLength = useAtomValue(nodeIDsTimelineLengthAtom)

    const onNextNodeCard = useSetAtom(onNextNodeAtom)
    const onPrevNodeCard = useSetAtom(onPrevNodeAtom)
    const increaseNodeFrquency = useSetAtom(increaseNodeFrquencyAtom)
    const decreaseNodeFrquency = useSetAtom(decreaseNodeFrquencyAtom)
    const removeNode = useSetAtom(removeNodeAtom)

    useEffect(() => {
        console.log("NodeCard nodeID", currentNode?.idx, "duration:", props.duration, "timleine idx:", currentTimelineIndex)
    }, [currentNode, isHovered, frontSideVisible, currentTimelineIndex])

    
    async function getNodesInDB() {
        const res = await fetch('api/index', {
            method: 'GET',
            headers: { 'content-type': 'aplication/json' },
        })
        const data = await res.json()
        console.log('NodeCard.getNodesInDB nodes from database', data)
        return data
    }
    useEffect(() => {

    }, [nodes])

    useHotkeys('ctrl+d', (e) => {
        e.preventDefault()

        async function removeNodeInDB(nodeID) {
            const res = await fetch('/api/index', {
                method: 'DELETE',
                headers: { 'Content-Type': 'text/plain' },
                body: nodeID,
            });
            const data = await res.json();
            console.log('NodeCard.removeNodeInDB nodes from database', data)
    
            return data.node;
        }

        removeNodeInDB(currentNode.id).then(removedNode => { removeNode(removedNode.idx) })
    })

    const animation = useAnimationControls()
    let initialStyles = {
        opacity: .125,
        width: "525px",
    }
    let targetStyles = {
        opacity: .15,
        width: "0px",
        transition: {
            duration: props.duration,
            ease: "linear"
        }
    }

    function handleClick(e) {
        if (e.target.id === "node-card") { setFrontSideVisible(!frontSideVisible) }
    }

    function restartCardAnimation() {
        animation.stop()
        animation.set(initialStyles)
        animation.start(targetStyles)
    }
    function animateNextCard() {
        onNextNodeCard()
        restartCardAnimation()
    }
    function animatePrevCard() {
        onPrevNodeCard()
        restartCardAnimation()
    }

    useEffect(() => {
        if (!frontSideVisible || isHovered) {
            animation.stop()
        } else {
            animation.start(targetStyles)
        }
    }, [frontSideVisible, isHovered, props.duration])


    let TimerBar =
        <StyledTimerBar $isVisible={frontSideVisible} $isHovered={isHovered}
            animate={animation}
            initial={initialStyles}
            onAnimationComplete={() => { animateNextCard() }}
        />

    let CardControls =
        <div className="card-controls" >
            <IconButton className="nav-btn top left outlined"
                onClick={() => { animatePrevCard() }}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton className="nav-btn top right outlined"
                onClick={() => { animateNextCard() }}
            >
                <KeyboardArrowRightIcon disabled={true} />
            </IconButton>
            {!frontSideVisible && <div>
                <IconButton className="nav-btn bottom left outlined"
                    onClick={() => { decreaseNodeFrquency(currentNode.idx) }}
                >
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right outlined"
                    onClick={() => { increaseNodeFrquency(currentNode.idx) }}
                >
                    <ArrowDropUpIcon />
                </IconButton>
            </div>}
        </div>

    let CardContent =
        <div className="card-content" >
            <StyledCardSide id="front-side" $isVisible={frontSideVisible} $isHovered={isHovered}>
                {currentNode?.title && <h1 >{currentNode?.title} </h1>}
                <p> {currentNode?.content} </p>
            </StyledCardSide>
            <StyledCardSide id="back-side" $isVisible={!frontSideVisible} $isHovered={isHovered}>
                <h1> Node #{currentNode?.idx + 1} [{currentTimelineIndex + 1} / {nodeIDsTimelineLength}] </h1>
                <p> Inspiration: {currentNode?.inspiration}  </p><br></br>
                <p className="frequency">
                    {(currentNode?.frequency * 100).toFixed(2)}% Likely to appear
                </p>
            </StyledCardSide>
        </div>

    return (
        <StyledNodeCard id="node-card" $isHovered={isHovered} tabIndex='-1'
            onClick={(e) => { handleClick(e) }}
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => { setIsHovered(false) }}
        >
            {TimerBar}
            {CardControls}
            {CardContent}
        </StyledNodeCard>
    );
}

const StyledTimerBar = styled(motion.div)`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 2px;
    bottom: .5px;
    filter: ${props => props.$isVisible ? "none" : (props.$isHovered ? "blur(3px)" : "blur(9px)")};
    pointer-events: none;
    height: 3px;
    margin: 0 auto;
    background-color: white;
`

const StyledCardSide = styled.div`
    opacity: ${props => props.$isVisible ? "1" : ".15"};
    filter: ${props => props.$isVisible ? "none" : (props.$isHovered ? "blur(3px)" : "blur(9px)")};
    transform: ${props => props.$isVisible ? "scale(1, 1)" : "scale(-1, 1)"};;
    padding: 10px 0px;
    grid-area: 1/1;
    pointer-events: none;
`

const StyledNodeCard = styled.div`
    background: #00219708;
    border-radius: 5px;
    box-shadow: 0px 0px 4px #CCC;
    padding: 20px 30px 30px;
    width: 525px;
    margin: 4px;
    position: relative;
    color: #EEE;
    backdrop-filter: ${props => props.$isHovered ? "blur(7px)" : "blur(13px)"};
    background-color: #222222C0;
    overflow: visible;

    :hover{
        background-color: #22222230;
    }

    .card-controls{
        display: none;
    }

    :hover > .card-controls {
        display: block;
    }

    .outlined:hover {
        outline: 1px solid #ffffff80;
    }
    
    .card-content{
        display: grid;
        align-items:center;
        pointer-events: none;
        height: auto;
    }

    .nav-btn {
        color: white;
        position: absolute;
        z-index: 1;
    }

    h1 {
        text-align: center;
        font-size: 1.2em;
        margin: 0px 15px 20px;
    }

    p {
        margin: auto;
        font-size: 1.2em;
    }

    .frequency {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -8px;
        font-size: .8em;
    }
    
    .left { left: 15px; }

    .right { right: 15px; }

    .top { top: 20px; }

    .bottom { bottom: 15px; }
`;
