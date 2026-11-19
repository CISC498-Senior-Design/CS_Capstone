import { useState } from "react";
import { Link } from "react-router";
import { AudioModal } from "./ModalAudioDragIn";
import AuthButton from "./AuthButton";
import "./Components.css";

function Topbar(){
    const [audioOpen, setAudioOpen] = useState(false);
    return (
    <div className="topbar">
        <nav>
            <Link to="/">To Main</Link> | <Link to="/about">To About</Link> 
        </nav>
        <button className="record-btn" onClick={() => {setAudioOpen(true)}}>
            🎧 Record
        </button>
        <AudioModal
            open={audioOpen}
            onClose={() => setAudioOpen(false)}
            onStartRecording={() => {
            setAudioOpen(false);
                //placeholder
            }}
        />
    <AuthButton></AuthButton>
    </div>)
}

export default Topbar;