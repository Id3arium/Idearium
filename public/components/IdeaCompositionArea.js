'use client';
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import _ from "lodash";
import styled from "@emotion/styled";
import { atom, useAtom, useSetAtom } from 'jotai';
import PositionedComponent from "@/components/PositionedComponent.js";
import * as API from "@/utils/api.js"
import {addNodeAtom} from "@/utils/atoms.js"
import { useCreateNode } from '@/lib/hooks/useCreateNode';

const emptyNote = { title: "", content: "", inspiration: "" };
const noteAtom = atom(emptyNote)
const isExpandedAtom = atom(false)

function IdeaCompositionArea() {
    const [note, setNote] = useAtom(noteAtom);
    const createNode = useCreateNode();
    const [isExpanded, setIsExpanded] = useAtom(isExpandedAtom);
    const addNode = useSetAtom(addNodeAtom);

    function onInputChanged(e) {
        const { name, value } = e.target;
        setNote((prevNote) => {
            return {
                ...prevNote,
                [name]: value
            };
        });
    }

    async function onAddButtonClicked(e) {
        e.preventDefault();
        if (!_.isEqual(note, emptyNote)) {
            let noteData = {
                title: note.title,
                content: note.content,
                inspiration: note.inspiration,
            }
            setNote(emptyNote)
            setIsExpanded(false)
            const newNode = createNode(noteData)
            const nodeFromDB = await API.createNodeInDB(newNode)
            console.log("IdeaCompositionArea node from bd", nodeFromDB)
            addNode(nodeFromDB)
        }
    }

    const ideaForm = <form className="create-note" onFocus={() => setIsExpanded(true)}>
        {isExpanded &&
            <input
                name="title"
                placeholder="Title"
                value={note.title}
                onChange={(e) => { onInputChanged(e); }} />}
        <textarea
            name="content"
            placeholder={isExpanded ? "Content" : "Compose an Idea..."}
            rows={isExpanded ? "4" : "1"}
            value={note.content}
            onChange={(e) => { onInputChanged(e); }} />
        {isExpanded &&
            <input
                name="inspiration"
                placeholder={"Inspiration"}
                rows={1}
                value={note.inspiration}
                onChange={(e) => { onInputChanged(e); }} />}
        <Zoom in={isExpanded}>
            <Fab onClick={async (e) => { await onAddButtonClicked(e); }}>
                <AddIcon />
            </Fab>
        </Zoom>
    </form>;
    return (
        <PositionedComponent id="positioned-component" position="top-left">
            <StyledCreateArea
                id="create-area"
                onFocus={() => setIsExpanded(true)}
            >
                {ideaForm}
            </StyledCreateArea>
        </PositionedComponent>

    );
}

let StyledCreateArea = styled.div`
    width: 400px;
    margin: 20px;

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