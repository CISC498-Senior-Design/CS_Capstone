import { useState } from "react";
import { api, type NoteSummary } from "../../apihelper";

interface SidebarProps{
    notes : NoteSummary[];  
    onCreated: () => Promise<void>;  
}

export function Sidebar({notes, onCreated}:SidebarProps){
    const [creating, setCreating] = useState(false);

    async function handleNewNote() {
        setCreating(true);
        try {
        await api.createNote(); //creates a real Google Doc
        await onCreated(); //refresh the list
        } catch {
        alert("Couldn't create the note. Please try again.");
        } finally {
        setCreating(false);
        }
        
    }
    return <div className="sidebar">
        Sidebar Placeholder
        <button className="note-button" onClick={handleNewNote} disabled={creating}>
            {creating ? "Creating…" : "+ New note"}
        </button>
        <ul className="note-list">
            {notes.map((note) => (
            <li key={note.id}> {note.name} </li>
            ))}
        </ul>
    </div>
}