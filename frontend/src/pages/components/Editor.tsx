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


    return <div className="editor">
        Editor Placeholder
    </div>
}