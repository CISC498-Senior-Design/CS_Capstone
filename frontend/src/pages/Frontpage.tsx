import DragInFile from "./components/DragInFile";

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("audio", file); // "audio" must match upload.single("audio")

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  console.log("Got file: " + data);
}

function FrontPage(){
    return <div>
        <DragInFile onFileSelected={uploadFile} />
    </div>
}

export default FrontPage;