import { useNavigate } from "react-router-dom";
import { useState } from "react";


function DashBoard(){
    const username = localStorage.getItem(username);
    const navigate = useNavigate();
    const [disconnecta,setDisconnecta] = useState(false);
    
    
    const disconnection = () =>{
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/home");
    }

    return (
        <>
            <h1>Welcome Home {username} !!!</h1>
            <nav>
                <div>create new story ?!</div>
                <div>Your Articles</div>
                <div>on work...</div>
            </nav>

            <button>Home</button>
            <button onClick={()=>setDisconnecta(true)}>Disconnect?</button>
            {disconnecta && (
                <>  <p>Are you sure ?</p>
                    <button onClick={disconnection}>Yes</button>
                    <button onClick={()=>setDisconnecta(false)}>No</button>
                </>)}
        </>
    )
}