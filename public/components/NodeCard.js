'use client';
import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { motion, useAnimationControls } from "framer-motion";
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentNodeAtom, currentTimelineIndexAtom, nodeTimelineLengthAtom, removeNodeAtom } from '@/public/atoms.js';
import { onPrevNodeAtom, onNextNodeAtom, decreaseNodeFrquencyAtom, increaseNodeFrquencyAtom } from '@/public/atoms.js';
import { useHotkeys } from "react-hotkeys-hook";
import PositionedComponent from "./PositionedComponent";

const isHoveredAtom = atom(false)
const frontSideVisibleAtom = atom(true)

export default function NodeCard(props) {
    const wordsPerMinute = 50
    const [duration, setDuration] = useState(0);
    const [isHovered, setIsHovered] = useAtom(isHoveredAtom)
    const [frontSideVisible, setFrontSideVisible] = useAtom(frontSideVisibleAtom)

    const currentNode = useAtomValue(currentNodeAtom)
    const currentTimelineIndex = useAtomValue(currentTimelineIndexAtom)
    const nodeIDsTimelineLength = useAtomValue(nodeTimelineLengthAtom)

    const onNextNodeCard = useSetAtom(onNextNodeAtom)
    const onPrevNodeCard = useSetAtom(onPrevNodeAtom)
    const removeNode = useSetAtom(removeNodeAtom)
    // const increaseNodeFrquency = useSetAtom(increaseNodeFrquencyAtom)
    // const decreaseNodeFrquency = useSetAtom(decreaseNodeFrquencyAtom)

    const hasFetchedFirstNode = useRef(false);

    useEffect(() => {
        if (!hasFetchedFirstNode.current) {
            fetchNextRandomNode(currentNode).then(randNode => {
                if (randNode != null) {
                    onNextNodeCard(randNode);
                }
            });
            hasFetchedFirstNode.current = true;
        }
    }, [])

    useEffect(() => {
        if (!frontSideVisible || isHovered) {
            animation.stop()
        } else {
            animation.start(targetStyles)
        }
    }, [frontSideVisible, isHovered, duration])


    useEffect(() => {
        setDuration(getCurrentNodeCardDuration(wordsPerMinute));
        console.log("NodeCard nodeID", currentNode?.idx, "duration:", duration, "timleine idx:", currentTimelineIndex)
    }, [currentNode]);

    async function fetchNodes() {
        const res = await fetch('api/index', {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        })
        const data = await res.json()
        console.log('NodeCard.fetchNodes nodes from database', data)
        return data
    }

    async function fetchNextRandomNode(currNode) {
        const queryParams = new URLSearchParams({
            "next-random-node": true,
            "curr-node-id": currNode ? currNode.id : null,
        });
        const url = `/api/index?${queryParams.toString()}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        })
        const randNodeData = await res.json()
        if (randNodeData.node) {
            console.log('NodeCard.fetfetchNextRandomNode() randNodeData.node', randNodeData.node)
            return randNodeData.node
        }
        return null
    }

    async function fetchNodeById(nodeID) {
        const queryParams = new URLSearchParams({
            "get-node-by-id": true,
            "node-id": nodeID,
        });
        const url = `/api/index?${queryParams.toString()}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        })
        const nodeData = await res.json()
        if (nodeData.node) {
            console.log('NodeCard.fetchNode() node', nodeData.node)
            // setCurrentNode(nodeData.node)
            return nodeData.node
        }
        return null
    }


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

    function getCurrentNodeCardDuration(wordsPerMinute = 60) {
        let minTime = 1
        if (currentNode == null) { return 0 }
        const wordCount = currentNode?.title.split(' ').length + currentNode?.content.split(' ').length
        const nonSpaceCharCount = currentNode?.title.length + currentNode?.content.length - (wordCount - 1)
        const wordCharCount = nonSpaceCharCount / wordCount

        const averageWordCharCount = 5.1
        let readingTimeScaler = wordCharCount / averageWordCharCount
        const readingSpeedInSeconds = readingTimeScaler * (wordCount / (wordsPerMinute / 60))
        // console.log("getCurrentNodeCardDuration readingSpeedInSeconds", readingSpeedInSeconds )
        return _.round(Math.max(readingSpeedInSeconds, minTime), 2)
    }

    const animation = useAnimationControls()
    let initialStyles = {
        opacity: .125,
        width: "525px",
    }
    let targetStyles = {
        opacity: .15,
        width: "0px",
        transition: {
            duration: duration,
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

    async function onNextCardCliked() {
        if (currentNode == null) { return }
        let randNode = await fetchNextRandomNode(currentNode)
        onNextNodeCard(randNode)
        restartCardAnimation()
    }

    function onPrevCardClicked() {
        onPrevNodeCard()
        restartCardAnimation()
    }

    let TimerBar =
        <StyledTimerBar $isVisible={frontSideVisible} $isHovered={isHovered}
            animate={animation}
            initial={initialStyles}
            onAnimationComplete={async () => { await onNextCardCliked() }}
        />

    let CardControls =
        <div className="card-controls" >
            <IconButton className="nav-btn top left outlined"
                onClick={() => { onPrevCardClicked() }}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton className="nav-btn top right outlined"
                onClick={async () => { await onNextCardCliked() }}
            >
                <KeyboardArrowRightIcon disabled={true} />
            </IconButton>
            {!frontSideVisible && <div>
                <IconButton className="nav-btn bottom left outlined"
                    onClick={() => { decreaseNodeFrquency(currentNode.id) }}
                >
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right outlined"
                    onClick={() => { increaseNodeFrquency(currentNode.id) }}
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
        <PositionedComponent id="positioned-component" position="middle-center">
            <StyledNodeCard id="node-card" $isHovered={isHovered} tabIndex='-1'
                onClick={(e) => { handleClick(e) }}
                onMouseEnter={() => { setIsHovered(true) }}
                onMouseLeave={() => { setIsHovered(false) }}
            >
                {TimerBar}
                {CardControls}
                {CardContent}
            </StyledNodeCard>
        </PositionedComponent>

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
    backdrop-filter: ${props => props.$isHovered ? "blur(4px)" : "blur(15px)"};
    background-color: #22222260;
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
