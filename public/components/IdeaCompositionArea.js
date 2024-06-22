"use client";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { useSetAtom } from "jotai";
import { addNodeAtom } from "@/utils/atoms.js";
import { useCreateNode } from "@/lib/hooks/useCreateNode";

function IdeaCompositionArea() {
    const [note, setNote] = useState({ title: "", content: "", inspiration: "" });
    const [isExpanded, setIsExpanded] = useState(false);
    const createNode = useCreateNode();
    const addNode = useSetAtom(addNodeAtom);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setNote(prevNote => ({ ...prevNote, [name]: value }));
    }

    function resetForm() {
        setNote({ title: "", content: "", inspiration: "" });
        setIsExpanded(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (note.content && note.inspiration) {
            const newNode = await createNode(note);
            await addNode(newNode);
        }
        resetForm();
    }

    return (
        <div className="w-[400px] m-5">
            <form onSubmit={handleSubmit} className={`transition-all duration-150 ease-in-out focus:outline-none focus:ring-0 bg-clear rounded-lg shadow-[0_0_6px_#CCC] backdrop-blur-[9px]`}>
                {isExpanded ? (
                    <>
                        <input
                            type="text"
                            name="title"
                            className="w-full bg-clear p-2.5 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                            placeholder="Title (optional)"
                            value={note.title}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="content"
                            className="w-full bg-clear p-2.5 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                            rows="4"
                            placeholder="Content"
                            value={note.content}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="inspiration"
                            className="w-full bg-clear p-2.5 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                            placeholder="Inspiration"
                            value={note.inspiration}
                            onChange={handleInputChange}
                        />
                        <div className="absolute bottom-[-20px] -right-0 bg-clear">
                            <Zoom in={isExpanded}>
                                <Fab size="small" type="submit">
                                    <AddIcon />
                                </Fab>
                            </Zoom>
                        </div>
                    </>
                ) : (
                    <input
                        type="text"
                        className="w-full bg-clear p-2.5 text-white rounded-lg"
                        placeholder="Compose An Idea..."
                        value=""
                        onChange={() => setIsExpanded(true)}
                        onFocus={() => setIsExpanded(true)}
                    />
                )}
            </form>
        </div>
    );
}

export default IdeaCompositionArea;