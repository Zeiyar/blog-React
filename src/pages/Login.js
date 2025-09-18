import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async(e) =>{
        e.preventDefault();

        const res = await fetch("https://blog-react-backend-3.onrender.com/auth/login",{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email,password}),
        });
        
        const data = await res.json()

        if (res.ok){
            localStorage.setItem("token",data.token);
            localStorage.setItem("username",data.username);
            navigate("/dashboard");
        } else {
            alert(data.message);
        }
    } 

    return (
        <form onSubmit={handleSubmit}>
            <p>Welcome user !!!</p>

            <input 
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="doulbi@gmail.com"/>

            <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="4327Gbjsq&"/>

            <button type="submit">Submit</button>
            <button onClick={()=>navigate("/register")}>First time ?</button>
            <button onClick={()=>navigate("/")}>back?</button>
        </form>
    );
}

export default Login;