import { Modal } from "./Modal.tsx";
import DragInFile from "./DragInFile";
import "./ModalAudioDragin.css"

interface Props {
  open: boolean;
  onClose: () => void;
  onStartRecording: () => void;
};

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("audio", file); // "audio" must match upload.single("audio")

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  console.log("Got file: " + data);
}


export function AudioModal({ open, onClose, onStartRecording }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="audio-icon">🎙️</div>
      <p className="eyebrow">Audio note</p>
      <h2 id="audio-note-title">Capture your thoughts</h2>
      <p className="subtitle">
        Luma transcribes your voice directly into this note while you speak.
      </p>

      <button className="primary-btn" onClick={onStartRecording}>
        Start recording PLACEHOLDER
      </button>

      <div className="divider"><span>or upload audio</span></div>

      <DragInFile onFileSelected={uploadFile} />

      <p className="footnote">Audio stays on this device</p>
    </Modal>
  );

}