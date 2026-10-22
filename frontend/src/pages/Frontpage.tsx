import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router";
import DragInFile from "./components/DragInFile";

function FrontPage(){
    return <div>
        <DragInFile onFileSelected={(f) => console.log("Got file:", f)} />
    </div>
}

export default FrontPage;