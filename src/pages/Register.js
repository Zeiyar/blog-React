import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register(){
    const navigate = useNavigate();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [visible,setVisible] = useState(false);
    const [succesMessage,setSuccesMessage] = useState("success message will appear if you done it right");

    const handleSubmit = async(e) =>{
        e.preventDefault()

        try{
            const res = await fetch("https://blog-react-backend-3.onrender.com/auth/register",{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({username,email,password}),
        });
        
        const data = await res.json();
               
        if (res.ok){
            setSuccesMessage("You will be redirected in the login page thank you for register!!")
            setTimeout(()=>{navigate("/login")},2000);
        } else{
            setSuccesMessage(`Error : ${data.message}`);
        }
    } catch(err){
        setSuccesMessage("Something went wrong, please try again.")
    }};

        const rules = (s) => {
            const e = s.target.value
            setPassword(e)
            if (e.length >=8 &&
                /[a-z]/.test(e) &&
                /[A-Z]/.test(e) &&
                /[0-9]/.test(e) &&
                /[^a-zA-Z0-9]/.test(e))
                setVisible(true);
            else{
                setVisible(false);
            }
        };

    return(
        
    <form onSubmit={handleSubmit}>
        
        <h1>Register for writing article and much more !!!</h1>

        <input 
        value={email} 
        onChange={(e)=>setEmail(e.target.value)}
        type="email"
        placeholder="doulbi@gmail.com"
        required/>

        <input 
        value={username} 
        onChange={(e)=>setUsername(e.target.value)}
        type="text"
        placeholder="xxdoulbixx"
        required/>

        <p>For your safety you will need a strong password</p>
        <strong>
            Min 8 chars, uppercase, lowercase, numbers, and special symbols.
            <br />
            The submit button will appear only when your password is strong!
        </strong>
        <input 
        value={password} 
        onChange={rules}
        type="password"
        placeholder="4327Gbjsq&"
        required/>

        {!visible ? (
        <>
            <span>WEAK</span>
            <button onClick={()=>navigate("/login")}>Back?</button>
        </>
        ):(
        <>
            <strong>STRONG</strong>
            <button onClick={()=>navigate("/login")}>Back?</button>
            <button type="submit">Submit</button>
        </>)}
        <span>{succesMessage}</span>
    </form>
   )
}

export default Register;