import { useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const statusText: Record<SaveStatus, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved to Google Docs",
  error: "Couldn't save. Check your connection",
};

interface EditorProps{
    selectedId: string | null;
}

export function Editor({}: EditorProps){
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<SaveStatus>("idle");
    return <div className="editor">
        Editor Placeholder
    </div>
}