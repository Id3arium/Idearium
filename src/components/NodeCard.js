import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useNodeCardsAreaStore } from "./NodeCardsArea";

export default function NodeCard(props) {
    const [backSideVisible, setBackSideVisible] = useState(false)
    let nodeIDsTimeline = useNodeCardsAreaStore(state => state.nodeIDsTimeline)
    let currTimelineIdx = useNodeCardsAreaStore(state => state.currTimelineIdx)
    let currNodeID = useNodeCardsAreaStore(state => state.currNodeID)

	console.log("nodecard props", props)
	function handleClick(e){ 
		console.log("e.target",e.target)
		//if (e.target.className === "card-content"){
		if (e.target.id === "node-card"){
			setBackSideVisible(!backSideVisible)
		}
	}
    const deleteNodeCard = () => {
        props.onDelete(props.nodeData.id);
    };
    
    return (
    <StyledNodeCard id="node-card" onClick={handleClick}>
        <div className="card-controls" >
            <IconButton className="nav-btn top left" 
                onClick={() => {props.onPrev()}}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton className="nav-btn top right" 
                onClick={() => {props.onNext()}}
            >
                <KeyboardArrowRightIcon disabled={true}/>
            </IconButton>
            {backSideVisible && <div>
                <IconButton className="nav-btn bottom left" onClick={() => {props.onDecreaseNodeFreq(currNodeID)}}>
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right" onClick={() => {props.onIncreaseNodeFreq(currNodeID)}}>
                    <ArrowDropUpIcon />
                </IconButton>
            </div>}
        </div>
        
        <div className="card-content" >
            <StyledCardSide id="front-side" isVisible={!backSideVisible}>
                <div className="centered"> 
                    {props.nodeData.title && <h1 >{props.nodeData.title} </h1>}
                    <p>{props.nodeData.content}</p> 
                </div>
            </StyledCardSide>
            <StyledCardSide id="back-side" isVisible={backSideVisible}>
                <h1 > Node #{currNodeID+1} [{currTimelineIdx+1} / {nodeIDsTimeline.length}] </h1>
                <p>Inspiration: {props.nodeData.inspiration}  </p><br></br>
                <p className="frequency">
                    {(props.nodeData.frequency * 100).toFixed(1)}% Likely to appear
                </p>
            </StyledCardSide>
        </div>
        
    </StyledNodeCard>
    );
}

let StyledCardSide = styled.div`
  opacity: ${props => props.isVisible ? "1": ".1"};
  filter: ${props => props.isVisible ? "none": "blur(7px)"};
  transform: ${props => props.isVisible ? "scale(1, 1)": "scale(-1, 1)"};;
  padding: 10px 0px;
  grid-area: 1/1;
  pointer-events: none;
`

let StyledNodeCard = styled.div`
  background: #00219708;
  border-radius: 5px;
  box-shadow: 0px 0px 4px #ccc;
  padding: 25px;
  width: 525px;
  margin: 10px;
  backdrop-filter: blur(5px);
  position: relative;
  color: ${(props) => (props.primary ? "#111" : "#EEE")};
  :hover{
    background-color: #ffffff08;
  }

  .card-controls{
    display: none;
  }

  :hover > .card-controls {
    display: block;
    color: red;
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

  .centered {

    width: 100%;
    grid-area: 1/1;
    justify-content: center;
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
