import { useState } from "react";
import { AudioModal } from "./components/ModalAudioDragIn";


function FrontPage(){

    const [audioOpen, setAudioOpen] = useState(false);

    return <div>
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
        </div>
}

export default FrontPage;