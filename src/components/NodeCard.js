import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import styled from "styled-components";

export default function NodeCard(props) {
    const [backsideToggled, setBacksideToggled] = useState(false)
    const deleteNodeCard = () => {
        props.onDelete(props.nodeData.id);
    };
    let frontSide = 
    <div className="front-side" onClick={()=>setBacksideToggled(!backsideToggled)}>
        <h1>{props.nodeData.title} </h1>
        
        <p> {props.nodeData.content} </p>
    </div>
    let backSide = 
    <div className="back-side" onClick={()=>setBacksideToggled(!backsideToggled)}>
        <h1>[{props.currTimelineIdx+1} / {props.timelineSize}]</h1>
        <p>Inspiration: {props.nodeData.inspiration}</p>
        <p className="frequency">
            {(props.nodeData.frequency * 100).toFixed(1)}% Likely to appear
        </p>
    </div>
    
    return (
        <StyledNodeCard id="node-card" >
            <div>
                <button className="nav-btn top left" onClick={() => {props.onPrev()}}>
                    <KeyboardArrowLeftIcon />
                </button>
                <button className="nav-btn top right" onClick={() => {props.onNext()}}>
                    <KeyboardArrowRightIcon />
                </button>
            </div>
            {backsideToggled && <div>
                <button className="nav-btn bottom left" onClick={() => {props.onDecreaseNodeFreq()}}>
                    <ArrowDropDownIcon />
                </button>
                <button className="nav-btn bottom right" onClick={() => {props.onIncreaseNodeFreq()}}>
                    <ArrowDropUpIcon />
                </button>
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

  color: ${(props) => (props.primary ? "#111" : "#EEE")};

  .nav-btn {
    width: 35px;
    height: 35px;
    padding: 4px;
    position: absolute;
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
