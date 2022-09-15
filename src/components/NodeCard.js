import React, { useState, useEffect } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useNodesTimelineStore } from "../Store.js";
import { motion, useAnimationControls } from "framer-motion";

export default function NodeCard(props) {
    const [backSideVisible, setBackSideVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    let nodeIDsTimeline = useNodesTimelineStore(state => state.nodeIDsTimeline)
    let currTimelineIdx = useNodesTimelineStore(state => state.currTimelineIdx)

    const animation = useAnimationControls()
    let initialStyles = { opacity: .25,width: "585px"}
    let targetStyles = {
        opacity: .1, 
        width: "0px",
        transition: {
            duration: props.duration,
            ease: "linear"
        }
     }

	function handleClick(e){ 
        if (e.target.id === "node-card"){
            setBackSideVisible(!backSideVisible)
		}
	}

    const deleteNodeCard = () => {
        props.onDelete(props.nodeData.id);
    };

    function restartCardAnimation(){
        animation.stop()
        animation.set(initialStyles)
        animation.start(targetStyles)
    }
    function animateNextCard(){
        props.onNext()
        restartCardAnimation()
    }
    function animatePrevCard(){
        props.onPrev()
        restartCardAnimation()
    }

    useEffect(()=>{
        if (backSideVisible || isHovered){
            animation.stop()
        } else {
            animation.start(targetStyles)
        }
    },[backSideVisible,isHovered,props.duration])
    
    return (
    <StyledNodeCard id="node-card" 
        onClick={handleClick}  
        onMouseEnter={()=>{setIsHovered(true)}} 
        onMouseLeave={()=>{setIsHovered(false)}}
    >
        <TimerBar as={motion.div} isVisible={!backSideVisible} isHovered={isHovered}
            animate={animation} 
            initial={initialStyles}
            onAnimationComplete={animateNextCard}
        />
        <div className="card-controls" >
            <IconButton className="nav-btn top left outlined" 
                onClick={animatePrevCard}
            >
                <KeyboardArrowLeftIcon  />
            </IconButton>
            <IconButton className="nav-btn top right outlined" 
                onClick={animateNextCard}
            >
                <KeyboardArrowRightIcon disabled={true}/>
            </IconButton>
            {backSideVisible && <div>
                <IconButton className="nav-btn bottom left outlined" 
                    onClick={() => {props.onDecreaseNodeFreq(props.nodeID)}}
                >
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right outlined" 
                    onClick={() => {props.onIncreaseNodeFreq(props.nodeID)}}
                >
                    <ArrowDropUpIcon />
                </IconButton>
            </div>}
        </div>
        
        <div className="card-content" >
            <StyledCardSide id="front-side" isVisible={!backSideVisible} isHovered={isHovered}>
                {props.nodeData.title && <h1 >{props.nodeData.title} </h1>}
                <p>{props.nodeData.content}</p> 
            </StyledCardSide>
            <StyledCardSide id="back-side" isVisible={backSideVisible} isHovered={isHovered}>
                <h1 > Node #{props.nodeID+1} [{currTimelineIdx+1} / {nodeIDsTimeline.length}] </h1>
                <p>Inspiration: {props.nodeData.inspiration}  </p><br></br>
                <p className="frequency">
                    {(props.nodeData.frequency * 100).toFixed(1)}% Likely to appear
                </p>
            </StyledCardSide>
        </div>
        
    </StyledNodeCard>
    );
}

const TimerBar = styled.div`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 1px;
    bottom: 0px;
    filter: ${props => props.isVisible ? "none": (props.isHovered ? "blur(3px)" : "blur(9px)") };
    pointer-events: none;
    height: 5px;
    margin: 0 auto;
    background-color: white;
`

const StyledCardSide = styled.div`
  opacity: ${props => props.isVisible ? "1": ".15"};
  filter: ${props => props.isVisible ? "none": (props.isHovered ? "blur(3px)" : "blur(9px)") };
  transform: ${props => props.isVisible ? "scale(1, 1)": "scale(-1, 1)"};;
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
  backdrop-filter: blur(5px);
  background-color: #ffffff0C;
  overflow: visible;

  :hover{
    background-color: #ffffff00;
  }

  .card-controls{
    display: none;
  }

  :hover > .card-controls {
    display: block;
    color: red;
  }

  .outlined:hover {
    outline: 1px solid #ffffff40;
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
    font-size: 1.1em;
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
