import { useEffect, useRef, useState } from "react";
import { api } from "../../apihelper";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const statusText: Record<SaveStatus, string> = {
    idle: "",
    saving: "Saving…",
    saved: "Saved to Google Docs",
    error: "Couldn't save. Check your connection",
};

interface EditorProps{
    noteId: string;
    onSaved: () => void;
}

export function Editor({noteId, onSaved}: EditorProps){
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<SaveStatus>("idle");

    //useref doesn't change on renders
    const saveTimer = useRef<number | undefined>(undefined);
    const pending = useRef<{ title: string; content: string } | null>(null);

    //whenever editor opens or noteid changes, puts loading screen on waiting for noteid
    useEffect(() => {
    let ignore = false; //closure val that prevents different note from overiting previous note
    setLoading(true);
    api.getNote(noteId)
        .then((note) => {
            if (ignore) return;
            setTitle(note.name);
            setContent(note.content);
        })
        .catch(() => {
            if (!ignore) setStatus("error");
        })
        .finally(() => {
            if (!ignore) setLoading(false);
        });
        return () => { //cleaanup
            ignore = true;
        };
    }, [noteId]);

    async function saveContent(changes: { title: string; content: string }) {
        pending.current = null;
        setStatus("saving");
        try {
            await api.updateNote(noteId, changes);
            setStatus("saved");
            onSaved();   //refresh the sidebar so a new title shows up
        } catch {
            setStatus("error");
        }
    }

    //debouncer that reduces api requests from reduce saving
    function scheduleSave(nextTitle: string, nextContent: string) {
        pending.current = { title: nextTitle, content: nextContent };
        window.clearTimeout(saveTimer.current); 
        saveTimer.current = window.setTimeout(() => saveContent(pending.current!), 800); // wait a .8 sec
    }

    //save anything still waiting when switching notes or leaving the page
    useEffect(() => {
        return () => {
            window.clearTimeout(saveTimer.current);
            if (pending.current) api.updateNote(noteId, pending.current).catch(() => {});
        };
        //TODO: save when they actually leave the app
    }, [noteId]); //if new note selected, clean up

    if (loading) return <div className="editor">Loading…</div>;

    return <div className="editor">
        <input
            className="editor-title"
            value={title}
            placeholder="Untitled note"
            onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave(e.target.value, content);
            }}
        />
        <p className="editor-status">{statusText[status]}</p>
        <textarea
            className="editor-body"
            value={content}
            onChange={(e) => {
            setContent(e.target.value);
            scheduleSave(title, e.target.value);
            }}
        />
    </div>
}