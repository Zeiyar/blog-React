import DOMPurify from "dompurify";
import { useState,useEffect } from "react";

function ArticleView ({article,onBack}){
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const [comment,setComment] = useState("");
    const [rating,setRating] = useState(5);
    const [comments,setComments] = useState([]);

    useEffect(()=>{
        fetch(`https://blog-react-backend-3.onrender.com/comments/${article._id}`)
            .then(res=>res.json())
            .then(data=> setComments(data));
    },[article._id]);

    const addComments = async(e) =>{
        e.preventDefault();

        const res = await fetch("https://blog-react-backend-3.onrender.com/comments",{
            method: "POST",
            headers: ({"Content-Type":"application/json",Authorization : `Bearer ${token}`}),
            body:JSON.stringify({content:comment,rating, articleId: article._id}),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }
        
        setComments([data,...comments]);
        setComment("");
        setRating(5);
    }

    const handleDelete = async(comment_id,cusername) =>{
        if(!token || username !== cusername){
            return alert("you are not authorized to do that");
        }
    try{
        const res = await fetch(`https://blog-react-backend-3.onrender.com/comments/${article._id}/${comment_id}`,{
            method: "DELETE",
            headers: {Authorization : `Bearer ${token}`},
        });
        const data = await res.json();

        if (!res.ok){
            alert(data.message || "error deleting comment");
            return
        }
        
        setComments(comments.filter((c)=> c._id !== comment_id)) 
    }catch(err){
        console.error(err);
        alert("something went wrong")
    }
    }

    const averageRating = comments.length>0 ? comments.reduce((sum,c) => sum+ (Number(c.rating) || 0), 0).toFixed(1) / comments.length : null;

    return (
        <>
    <div className="Seeing">
        <h1>{article.title}</h1>
        <small>by {article.author} {averageRating&& `- ⭐${averageRating}/5`}</small>
        <small>created the {new Date(article.createdAt).toLocaleString()}</small>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content)}}/>
        <button onClick={onBack}>BACK</button>
    </div>

    <div className="comment-section">
        <hr />
    {username && (<form onSubmit={addComments} className="comments-form">
        <h3>Add a comment !!</h3>
        <select value={rating} onChange={(e)=>setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map((r)=>(<option key={r} value={r}>{r}</option>))}
        </select>
        <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="wright a comment..." required />
        <button type="submit">add</button>
    </form>)}

    <div className="comments-list">
        <h2>Comments :</h2>
        {comments.map((c) => (
            <div key={c._id} className="comment">
                <strong>{c.username}</strong> - ⭐ {c.rating}<br />
                <p>{DOMPurify.sanitize(c.content)}</p>
                <small>{new Date(c.createdAt).toLocaleString()}</small>
                <button onClick={handleDelete(c._id,c.username)}>X</button>
            </div>
        ))}
    </div>
    </div>
    </>)};

export default ArticleView;