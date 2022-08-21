import React from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styled from 'styled-components'

export default function NodeCard(props) {
  const deleteNodeCard = () => {
    props.onDelete(props.id);
  };
  return (
    <DivNodeCard className="DivNodeCard">
      <h1>{props.title} </h1>
      <button className="nav-btn prev" onClick={deleteNodeCard}>
        <KeyboardArrowLeftIcon />
      </button>
      <button className="nav-btn next" onClick={deleteNodeCard}>
        <KeyboardArrowRightIcon />
      </button>
      
      <p> {props.content} </p>
    </DivNodeCard>
  );
}

let DivNodeCard = styled.div `
  background: #00219708;
  border-radius: 5px;
  box-shadow: 0px 0px 4px #ccc;
  padding: 10px;
  width: 500px;
  height: 100%;
  margin: 10px;
  backdrop-filter: blur(5px);
  position:relative;
  
  color: ${(props) => (props.primary ? '#111' : '#EEE')};

  .nav-btn {
    width: 35px;
    height: 35px;
    padding: 4px;
    position: absolute;
    top: 8px;
  }

  .prev {
    left: 8px;
  }
  .next {
    right: 8px;
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
`
