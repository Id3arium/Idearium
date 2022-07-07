import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import _ from "lodash";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "" });
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
    let emptyNote = { title: "", content: "" };
    if (!_.isEqual(note, emptyNote)) {
      props.onAdd(note);
      setNote(emptyNote);
    }
  }
  function expandArea() {
    setIsExpanded(true);
  }
  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
          />
        )}

        <textarea
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? "4" : "1"}
          value={note.content}
          onChange={handleChange}
          onFocus={expandArea}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;