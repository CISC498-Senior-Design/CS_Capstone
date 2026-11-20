import { useState } from "react";
import { api, type NoteSummary } from "../../apihelper";

interface SidebarProps{
    notes : NoteSummary[];  
    onCreated: () => Promise<void>;
    selectedId: string | null;
    onSelect: (id: string) => void;  
}

export function Sidebar({notes, onCreated, selectedId, onSelect}:SidebarProps){
    const [creating, setCreating] = useState(false);

    async function handleNewNote() {
        setCreating(true);
        try {
        const created = await api.createNote(); //creates a real Google Doc
        await onCreated(); //refresh the list
        onSelect(created.id); // makes the selected note created in editor 
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
                <button
                className={note.id === selectedId ? "note-item active" : "note-item"}
                onClick={() => onSelect(note.id)}
                >
                    {note.name}
                </button>
            ))}
        </ul>
    </div>
}