import DOMPurify from "dompurify";
import { useState,useEffect } from ReactDOM;

function ArticleView ({article,onBack}){
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const [comment,setComment] = useState("");
    const [rating,setRating] = useState("");
    const [comments,setComments] = useState("");

    useEffect(()=>{
        fetch(`https://blog-react-backend-3.onrender.com/comments/${article._id}`)
            .then(res=>res.json)
            .then(data=> setComments(data));
    },[article._id]);

    const addComments = async(e) =>{
        e.preventDefault();

        const res = fetch("https://blog-react-backend-3.onrender.com/comments",{
            method: "POST",
            headers: ({"Content-Type":"application/json",Authorization : `Bearer ${token}`}),
            body:JSON.stringify({content:comment,rating, articleId: article._id}),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }
        
        setComments([...comments,data]);
        setComment("");
        setRating(5);
    }

    return (
        <>
    <div className="Seeing">
        <h1>{article.title}</h1>
        <small>by {article.author}</small>
        <small>created the {new Date(article.createdAt).toLocaleString()}</small>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content)}}/>
        <button onClick={onBack}>BACK</button>
    </div>

    <div className="comments-list">
        <h2>Comments :</h2>
        {comments.map((comment)=>{
            <div key={comment._id} className="comment">
                <strong>{comment.username}</strong> - ⭐ {comment.rating}<br />
                <p>{DOMPurify.sanitize(comment.content)}</p>
                <small>{new Date (comment.createdAt).toLocaleString()}</small>
            </div>
        })}
    </div>

    {username && (<form onSubmit={addComments} className="comments-form">
        <h3>Add a comment !!</h3>
        <select value={rating} onChange={(e)=>setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map((r)=>(<option key={r} value={r}>{r}</option>))}
        </select>
        <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="wright a comment..." required />
        <button type="submit">add</button>
    </form>)}
    </>)};

export default ArticleView;