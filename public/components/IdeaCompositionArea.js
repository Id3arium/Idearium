'use client';
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import styled from "@emotion/styled";
import { atom, useAtom, useSetAtom, useAtomValue } from 'jotai';
import { nodesAtom, addNodeAtom } from '@/public/atoms.js';

const noteAtom = atom({ title: "", content: "", inspiration: "" })
const isExpandedAtom = atom(false)

function IdeaCompositionArea() {
    const [note, setNote] = useAtom(noteAtom);
    const [isExpanded, setIsExpanded] = useAtom(isExpandedAtom);
    const addNode = useSetAtom(addNodeAtom);
    const nodes = useAtomValue(nodesAtom);
    
    function onInputChanged(e) {
        const { name, value } = e.target;
        // console.log("onInputChanged", note)
        setNote((prevNote) => {
            return {
                ...prevNote,
                [name]: value
            };
        });
    }

    // const addNodeToDB = async (nodeData) => {
    function addNodeToDB(nodeData) {
        // const res = await fetch('/api/index', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(nodeData),
        // });
        // const newData = await res.json();
        // if (newData) {
            addNode(newNode)
        // }
    };

    // async function onAddButtonClicked(e) {
    function onAddButtonClicked(e) {
        e.preventDefault();
        let emptyNote = { title: "", content: "", inspiration: "" };
        console.log("e",e)
        if (!_.isEqual(note, emptyNote)) {
            let newNode = {
                id: uuidv4(),
            	idx: nodes.length,
            	title: note.title,
            	content: note.title && !note.content ? note.title : note.content,
            	inspiration: note.inspiration,
            	frequency: 1 / (nodes.length + 1),
                ranking: nodes.length + 1
            }
            // addNodeToDB(newNode)
            addNode(newNode)
            setNote(emptyNote)
            setIsExpanded(false)
        }
    }

    return (
        <StyledCreateArea 
            id="create-area"
            onFocus={()=>setIsExpanded(true)}
        >
            <form className="create-note" onFocus={()=>setIsExpanded(true)}>
                {isExpanded && 
                    <input
                        name="title"
                        placeholder="Title"
                        value={note.title}
                        onChange={(e)=>{onInputChanged(e)}}
                    />
                }
                <textarea
                    name="content"
                    placeholder={isExpanded ? "Content" : "Compose an Idea..." }
                    rows={isExpanded ? "4" : "1"}
                    value={note.content}
                    onChange={(e)=>{onInputChanged(e)}}
                />
                {isExpanded &&
                    <input
                        name="inspiration"
                        placeholder={"Inspiration" }
                        rows={1}
                        value={note.inspiration}
                        onChange={(e)=>{onInputChanged(e)}}
                    />
                }
                <Zoom in={isExpanded}>
                    <Fab onClick={(e)=>{onAddButtonClicked(e)}}>
                        <AddIcon />
                    </Fab>
                </Zoom>
            </form>
        </StyledCreateArea>
    );
}

let StyledCreateArea = styled.div`
    width: 400px;
    height: 400px;
    margin: 30px 20px;
    position: absolute;
    left: 0;

    form.create-note {
        position: relative;
        backdrop-filter: blur(7px);
        background: transparent;
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
        background: transparent;
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