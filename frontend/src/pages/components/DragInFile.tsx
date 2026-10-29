import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";


interface Props {
    onFileSelected?: (file: File) => void;
}

function DragInFile({ onFileSelected }: Props){
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      setError("Please choose an audio file (mp3, wav, ogg, etc.)");
      return;
    }
    setError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    onFileSelected?.(f);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); // required, or the browser won't allow a drop
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); // stops the browser from opening the file itself
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
    e.target.value = ""; // lets the same file be picked again
  }


    return <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        style={{
          border: `2px dashed ${isDragging ? "#4f46e5" : "#999"}`,
          background: isDragging ? "#eef2ff" : "transparent",
          borderRadius: 12,
          padding: 40,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        {file ? (
          <p>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
        ) : (
          <p>Drag an audio file here, or click to browse</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleInputChange}
        hidden
      />

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {previewUrl && (
        <audio controls src={previewUrl} style={{ marginTop: 16, width: "100%" }} />
      )}
    </div>
}

export default DragInFile;