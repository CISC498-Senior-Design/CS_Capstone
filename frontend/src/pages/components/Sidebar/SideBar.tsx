import { NewNoteButton } from "./NewNoteButton";
import { NotesList } from "./NotesList";

export function Sidebar(){
    return <div className="sidebar">
        Sidebar Placeholder
        <NewNoteButton></NewNoteButton>
        <NotesList></NotesList>
    </div>
}