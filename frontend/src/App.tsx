import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import FrontPage from "./pages/Frontpage.tsx"
import GoogleDoc from "./pages/GoogleDocs.tsx"
import About from "./pages/About.tsx";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data: { message: string }) => setMessage(data.message))
      .catch(() => setMessage("Couldn't reach the server"));
  }, []);

  return <div>{message} 
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/output" element={<GoogleDoc />} />
      <Route path="/about" element={<About/>} />
    </Routes></div>;
}

export default App;