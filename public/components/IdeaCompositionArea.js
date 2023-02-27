'use client';
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import _ from "lodash";
import styled from "@emotion/styled";

function IdeaCompositionArea(props) {
  const [note, setNote] = useState({ title: "", content: "", inspiration: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  function handleChange(e) {
    const { name, value } = e.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }
  function submitNote(e) {
    e.preventDefault();
    let emptyNote = { title: "", content: "", inspiration: "" };
    if (!_.isEqual(note, emptyNote)) {
      props.onAdd(note);
      setNote(emptyNote);
    }
  }

  return (
    <StyledCreateArea 
        id="create-area"
        onFocus={()=>setIsExpanded(true)}
        onBlur={()=>setIsExpanded(false)}
    >
        <form className="create-note">
            {isExpanded && 
                <input
                    name="title"
                    placeholder="Title"
                    value={note.title}
                    onChange={handleChange}
                />
            }

            <textarea
                name="content"
                placeholder={isExpanded ? "Content" : "Compose an Idea..." }
                rows={isExpanded ? "4" : "1"}
                value={note.content}
                onChange={handleChange}
            />
            {isExpanded &&
                <input
                    name="inspiration"
                    placeholder={"Inspiration" }
                    rows={1}
                    value={note.inspiration}
                    onChange={handleChange}
                />
            }
            <Zoom in={isExpanded}>
            <Fab onClick={submitNote}>
                <AddIcon />
            </Fab>
            </Zoom>
        </form>
    </StyledCreateArea>
  );
}

let StyledCreateArea = styled.div`
  width: 400px;
  height: 300px;
  margin: 30px 20px;
  position: absolute;
  left: 0;

  form.create-note {
    position: relative;
    backdrop-filter: blur(7px);
    background: #00000000;
    padding: 10px;
    border-radius: 7px;
    box-shadow: 0px 0px 4px #CCC;
  }

  form.create-note input,
  form.create-note textarea {
    color: #EEE;
    width: 100%;
    height: 30px;
    border: none;
    background: #00000000;
    padding: 4px;
    outline: none;
    font-size: 1.2em;
    font-family: inherit;
    resize: none;
  }

  form.create-note button {
    position: absolute;
    right: 12px;
    bottom: -18px;
    background: #1313f580;
    backdrop-filter: blur(5px);
    color: #CCC;
    border: 1px solid black;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    outline: none;
  }

`

export default IdeaCompositionArea;