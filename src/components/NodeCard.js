import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NodeCard(props) {
  const deleteNodeCard = () => {
    props.onDelete(props.id);
  };
  return (
    <div className="note">
      <button onClick={deleteNodeCard}>
        <DeleteIcon />
      </button>
      <h1>{props.title} </h1>
      <p> {props.content} </p>
    </div>
  );
}
