import React, { useEffect, useState } from 'react';
import './Notes.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [draggedNote, setDraggedNote] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const availableNotes = localStorage.getItem('notes');
    availableNotes ? setNotes(JSON.parse(availableNotes)) : setNotes([]);
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleMouseDown = (e, id, pinned) => {
    if (pinned) {
      return;
    } else {
      setDraggedNote(id);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedNote !== null) {
      const x = e.clientX - dragStart.x;
      const y = e.clientY - dragStart.y;

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === draggedNote
            ? { ...note, x: note.x + x, y: note.y + y }
            : note
        )
      );

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
    setDragStart({ x: 0, y: 0 });
  };

  const handleEdit = (id) => {
    if (editId === id) {
      setEditId(null);
    } else {
      setEditId(id);
    }
  };

  const handleEditTitle = (e, id) => {
    let editNote = notes.map((ele) =>
      ele.id === id ? { ...ele, title: e.target.value } : ele
    );
    setNotes(editNote);
  };

  const handleDelete = (id) => {
    let delNote = notes.filter((ele) => ele.id !== id);
    setNotes(delNote);
  };

  const handlePin = (id) => {
    let pinNote = notes.map((ele) =>
      ele.id === id ? { ...ele, pinned: !ele.pinned } : ele
    );
    setNotes(pinNote);
  };

  const addNote = (title) => {
    let newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 0;
    let x = notes.length > 0 ? notes[notes.length - 1].x + 5 : 400;
    let y = notes.length > 0 ? notes[notes.length - 1].y + 5 : 10;

    let newData = { id: newId, title, pinned: false, x, y };
    setNotes((prev) => [...prev, newData]);
  };

  return (
    <>
      <div className="board" onMouseMove={(e) => handleMouseMove(e)}>
        <button
          className="add-note-btn"
          onClick={() => {
            const noteTitle = prompt('Enter note title:');
            if (noteTitle) {
              addNote(noteTitle);
            }
          }}
        >
          +
        </button>
        {notes.map((ele, ind) => (
          <div
            key={ele.id}
            onMouseDown={(e) => handleMouseDown(e, ele.id, ele.pinned)}
            onMouseUp={handleMouseUp}
            className="note"
            style={{
              zIndex: ele.pinned ? 1000 + ind : ind,
              left: ele.pinned ? 30 * ind + 'px' : ele.x + 'px',
              top: ele.pinned ? 30 * ind + 'px' : ele.y + 'px',
              cursor: ele.pinned ? 'default' : 'move',
              backgroundColor: ele.pinned ? '#FFD700' : '#FFFF3B',
              boxShadow: ele.pinned ? '3px 3px 10px rgba(0, 0, 0, 0.3)' : 'none',
            }}
          >
            {editId === ele.id ? (
              <textarea
                onChange={(e) => handleEditTitle(e, ele.id)}
                value={ele.title}
              />
            ) : (
              <p onClick={() => handleEdit(ele.id)}>{ele.title}</p>
            )}
            <div className="btn-container">
              <button onClick={() => handleEdit(ele.id)}>
                {editId === ele.id ? '✅' : '✏️'}
              </button>
              <button onClick={() => handleDelete(ele.id)}>❌</button>
              <button onClick={() => handlePin(ele.id)}>📌</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Notes;
