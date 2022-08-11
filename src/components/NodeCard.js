import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from 'styled-components'

export default function NodeCard(props) {
  const deleteNodeCard = () => {
    props.onDelete(props.id);
  };
  return (
    <DivNodeCard>
      <button onClick={deleteNodeCard}>
        <DeleteIcon />
      </button>
      <h1>{props.title} </h1>
      <p> {props.content} </p>
    </DivNodeCard>
  );
}

let DivNodeCard = styled.div `
  background: #00219708;
  border-radius: 5px;
  box-shadow: 0px 0px 4px #ccc;
  padding: 10px;
  width: 150px;
  margin: 10px;
  backdrop-filter: blur(5px);
  
  color: ${(props) => (props.primary ? 'hotpink' : 'turquoise')}

  h1 {
    font-size: 1.2em;
    margin: 6px 0;
  }

  p {
    font-size: 1.1em;
    margin: 6px 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`
