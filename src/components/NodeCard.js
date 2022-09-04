import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useNodeCardsAreaStore } from "./NodeCardsArea";

export default function NodeCard(props) {
    const [backsideToggled, setBacksideToggled] = useState(false)
    let nodeIDsTimeline = useNodeCardsAreaStore(state => state.nodeIDsTimeline)
    let currTimelineIdx = useNodeCardsAreaStore(state => state.currTimelineIdx)
    let currNodeID = useNodeCardsAreaStore(state => state.currNodeID)

	console.log("nodecard props", props)
	function handleClick(e){ 
		console.log("e.target",e.target)
		if (e.target.id === "node-card"){
			setBacksideToggled(!backsideToggled)
		}
	}
    const deleteNodeCard = () => {
        props.onDelete(props.nodeData.id);
    };
    let frontSide = 
    <div className="front-side">
        <h1>{props.nodeData.title} </h1>
        <p> {props.nodeData.content} </p>
    </div>
    let backSide = 
    <div className="back-side" >
        <h1>[{currTimelineIdx+1} / {nodeIDsTimeline.length}]</h1>
        <p>Inspiration: {props.nodeData.inspiration}</p>
        <p className="frequency">
            {(props.nodeData.frequency * 100).toFixed(1)}% Likely to appear
        </p>
    </div>
    
    return (
        <StyledNodeCard id="node-card" onClick={handleClick}>
            <div>
                <IconButton className="nav-btn top left" onClick={() => {props.onPrev()}}>
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton className="nav-btn top right" onClick={() => {props.onNext()}}>
                    <KeyboardArrowRightIcon disabled={true}/>
                </IconButton>
            </div>
            {backsideToggled && <div>
                <IconButton className="nav-btn bottom left" onClick={() => {props.onDecreaseNodeFreq(currNodeID)}}>
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right" onClick={() => {props.onIncreaseNodeFreq(currNodeID)}}>
                    <ArrowDropUpIcon />
                </IconButton>
            </div>}
            {!backsideToggled && frontSide}
            {backsideToggled && backSide}
        </StyledNodeCard>
    );
}

let StyledNodeCard = styled.div`
  background: #00219708;
  border-radius: 5px;
  box-shadow: 0px 0px 4px #ccc;
  padding: 10px;
  width: 500px;
  height: 200px;
  margin: 10px;
  backdrop-filter: blur(5px);
  position: relative;
  :hover{
    background-color: #ffffff08;
  }

  color: ${(props) => (props.primary ? "#111" : "#EEE")};

  .nav-btn {
	color: white;
    position: absolute;
    z-index: 1;
  }

  .left {
    left: 8px;
  }

  .right {
    right: 8px;
  }

  .up {
    top: 8px;
  }

  .bottom {
    bottom: 8px;
  }

  .front-side, .back-side{
	pointer-events: none;
  }

  h1 {
    text-align: center;
    font-size: 1.2em;
    margin: 6px 40px;
  }

  p {
    font-size: 1.1em;
    margin: 6px 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .frequency {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 15px;
    font-size: .8em;
  }
`;
