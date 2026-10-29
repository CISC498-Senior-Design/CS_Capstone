import { Link } from "react-router";

function Layout(){
    return <>
    <nav>
        <Link to="/">To Main</Link> | <Link to="/about">To About</Link> 
    </nav>
    </>
}

export default Layout;