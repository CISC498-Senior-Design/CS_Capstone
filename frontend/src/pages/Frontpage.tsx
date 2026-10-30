import Topbar from "./components/Topbar";
import { Sidebar } from "./components/Sidebar/SideBar";
import { Editor } from "./components/Editor";
import "./Frontpage.css"
import { StudyPanel } from "./components/StudyPanel";

function FrontPage(){

    return (
        <div className="frontpage">
            <Topbar></Topbar>
            <Sidebar></Sidebar>
            <Editor></Editor>
            <StudyPanel></StudyPanel>
        </div>
    )
}

export default FrontPage;