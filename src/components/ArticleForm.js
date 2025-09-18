import { useState, useEffect } from "react";

function ArticleForm ({onSubmit,initialData,onCancel}){
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [author,setAuthor] = useState("");
    const username = localStorage.getItem("username");

    useEffect(()=>{
        if (initialData){
            setTitle(initialData.title);
            setAuthor(initialData.author);
            setContent(initialData.content);
        }
    },[initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({title,author,content});
        setTitle("");
        setAuthor("");
        setContent("");
    }

    return (
        <form onSubmit={handleSubmit} className="add-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              value={username || author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <textarea
              placeholder="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            {onCancel && <button type="button" onClick={onCancel}>BACK</button>}
            <button type="submit">ADD</button>
        </form>)
}

export default ArticleForm;