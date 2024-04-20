"use client";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { Box, Button, Typography } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import _ from "lodash";
import styled from "@emotion/styled";
import { atom, useAtom, useSetAtom } from "jotai";
// import * as API from "@/utils/api.js"
import { addNodeAtom } from "@/utils/atoms.js";
import { useCreateNode } from "@/lib/hooks/useCreateNode";

const emptyNote = { title: "", content: "", inspiration: "" };
const noteAtom = atom(emptyNote);
const isExpandedAtom = atom(false);

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
                [name]: value,
            };
        });
    }

    async function onButtonClicked(e) {
        e.preventDefault();
        setIsExpanded(false);

        if (!_.isEqual(note, emptyNote)) {
            let noteData = {
                title: note.title,
                content: note.content,
                inspiration: note.inspiration,
            };
            setNote(emptyNote);
            const newNode = await createNode(noteData);
            await addNode(newNode);
        }
    }

    const ideaForm = (
        <form
            className={`transition-all duration-150 ease-in-out focus:outline-none focus:ring-0${
                isExpanded ? "p-2.5" : "p-0"
            } bg-clear rounded-lg shadow-[0_0_6px_#CCC] backdrop-blur-[9px]`}
        >
            {isExpanded ? (
                <>
                    <input
                        type="text"
                        className="w-full bg-clear p-1 m-2.5 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                        placeholder="Title"
                        value={note.title}
                        onChange={(e) => { onInputChanged(e); }}
                    />
                    <textarea
                        className="w-full bg-clear p-1 m-2.5 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md "
                        rows="4"
                        placeholder="Content"
                        value={note.content}
                        onChange={(e) => { onInputChanged(e); }}
                    />
                    <input
                        type="text"
                        className="w-full bg-clear p-1 m-2.5 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                        placeholder="Inspiration"
                        value={note.inspiration}
                        onChange={(e) => onInputChanged(e)}
                    />
                    <div className="absolute bottom-[-20px] -right-0 bg-clear">
                        <Zoom in={isExpanded}>
                            <Fab
                                size="small"
                                onClick={async (e) => {
                                    await onButtonClicked(e);
                                }}
                            >
                                <AddIcon/>
                            </Fab>
                        </Zoom>
                    </div> 
                </>
            ) : (
                <input
                    type="text"
                    className="w-full bg-clear p-3 text-white rounded-lg"
                    placeholder="Compose An Idea..."
                    onFocus={() => setIsExpanded(true)}
                />
            )}
        </form>
    );

    return (
        <div className="w-[400px] m-5">
            <div id="create-area">{ideaForm}</div>
        </div>
    );
}

export default IdeaCompositionArea;
