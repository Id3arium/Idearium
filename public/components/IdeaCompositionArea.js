"use client";
import React, { useState, useRef, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { useSetAtom } from "jotai";
import { addNodeAtom } from "@/utils/atoms.js";
import { useCreateNode } from "@/lib/hooks/useCreateNode";

function IdeaCompositionArea() {
    const [note, setNote] = useState({
        title: "",
        content: "",
        inspiration: "",
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const titleInputRef = useRef(null);

    const createNode = useCreateNode();
    const addNode = useSetAtom(addNodeAtom);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setNote((prevNote) => ({ ...prevNote, [name]: value }));
    }

    function resetForm() {
        setNote({ title: "", content: "", inspiration: "" });
        setIsExpanded(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (note.title || note.content || note.inspiration) {
            const newNode = await createNode(note);
            await addNode(newNode);
        }
        resetForm();
    }
    useEffect(() => {
        if (isExpanded) {
            titleInputRef.current?.focus();
        }
    }, [isExpanded]);

    return (
        <form
            onSubmit={handleSubmit}
            className={`
                ml-3 mr-1 transition-all duration-250 ease-in-out 
                focus:outline-none focus:ring-0 
                bg-clear rounded-md shadow-[0_0_6px_#CCC] backdrop-blur-[9px]
                ${isExpanded ? "h-auto" : "h-[44px]"}
            `}
        >
            <div
                id="note-input-bars"
                className={`top-0 left-0 w-full transition-all duration-250 ease-in-out 
                    ${isExpanded ? "opacity-100" : "opacity-0"}
                `}
            >
                <input
                    type="text"
                    name="title"
                    className="w-full bg-clear p-2.5 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                    placeholder="Title (Optional)"
                    ref={titleInputRef}
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
            </div>
            <input
                type="text"
                id="default-input-bar"
                className={` absolute top-0 left-0 w-full bg-clear p-2.5 text-white
                    rounded-md transition-all duration-250 ease-in-out
                    ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}
                `}
                placeholder="Compose An Idea..."
                onChange={() => setIsExpanded(true)}
                onFocus={() => setIsExpanded(true)}
            />
            <div
                className={`absolute -bottom-5 right-0 transition-all duration-250 ease-in-out
                    ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
            >
                <Zoom in={isExpanded}>
                    <Fab size="small" type="submit">
                        <AddIcon />
                    </Fab>
                </Zoom>
            </div>
        </form>
    );
}

export default IdeaCompositionArea;
