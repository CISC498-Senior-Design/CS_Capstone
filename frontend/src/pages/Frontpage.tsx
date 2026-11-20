import Topbar from "./components/Topbar";
import { Sidebar } from "./components/SideBar";
import { Editor } from "./components/Editor";
import "./Frontpage.css"
import { StudyPanel } from "./components/StudyPanel";
import { useCallback, useEffect, useState } from "react";
import { api, type NoteSummary } from "../apihelper";
import { useUser } from "../user";

function FrontPage(){
    const [notes, setNotes] = useState<NoteSummary[]>([]);
    const {user} = useUser();
    const [selectedId, setSelectedId] = useState<string>(""); //the selected note

    const refreshNotes = useCallback(async () => {
        setNotes(await api.listNotes());
    }, []);

    useEffect(() => {
        if (user) refreshNotes();
        else setNotes([]);
    }, [user, refreshNotes]);


    return (
        <div className="frontpage">
            <Topbar></Topbar>
            {user ? <Sidebar notes={notes} 
                onCreated={refreshNotes} 
                selectedId={selectedId}
                onSelect={setSelectedId}                
            ></Sidebar>
            : <div className="sidebar"> go log in</div>}
            {user ?  <Editor 
                noteId={selectedId} onSaved={refreshNotes} key={selectedId} 
            ></Editor>
            : <div className="editor"> go log in</div>}
            
            <StudyPanel></StudyPanel>
        </div>
    )
}

export default FrontPage;