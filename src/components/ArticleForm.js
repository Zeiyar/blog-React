import { useState, useEffect } from "react";

function ArticleForm ({onSubmit,initialData,onCancel}){
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");

    useEffect(()=>{
        if (initialData){
            setTitle(initialData.title);
            setContent(initialData.content);
        }
    },[initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({title,content});
        setTitle("");
        setContent("");
    }

    return (
        <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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