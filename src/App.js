import React, {useState,useEffect} from "react";

function App() {
  const [articles,setArticles] = useState([]);
  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");
  const [author,setAuthor] = useState("");
  const [editingId,setEditingId] = useState(null);
  const [search,setSearch] = useState("");
  const [seeingId,setSeeingId] = useState(null);
  const [addingArticle,setAddingArticle] = useState(false);

  useEffect(()=>{
    fetch("http://localhost:5000/articles")
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.log(err));
  },[]);

  const addArticle = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/articles",{
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title,author,content}),
    })
      .then(res => res.json())
      .then(newArticle => {
        setArticles([...articles,newArticle]);
        setTitle("");
        setAuthor("");
        setContent("");
      })
    .catch(err=>console.log(err));
  }
  const deleteArticle = (id) =>{
    fetch(`http://localhost:5000/articles/${id}`,{
      method: "DELETE",
    })
      .then(()=>{
        setArticles(articles.filter(article => article._id !== id))
      })
    .catch(err=>console.log(err))
  }
  const modifyArticle = (id,newTitle,newAuthor,newContent) =>{
    fetch(`http://localhost:5000/articles/${id}`,{
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title : newTitle,author : newAuthor,content : newContent}),
    })
      .then(res=>res.json())
      .then(updateArticle => {
        setArticles(articles.map(article=>article._id===id ? 
          updateArticle : article))
        })
      .catch(err=>console.log(err))
  }
  const filteredArticles = search ? articles.filter(article=>
    article.author.toLowerCase().includes(search.toLowerCase()) ||
    article.title.toLowerCase().includes(search.toLowerCase())) : articles;

  const getArticleById = (id) => {
    const article = articles.find(article => article._id===id)
    if (article) {
      setSeeingId(id);
    }
  }

const seeingArticle = seeingId ? articles.find(a => a._id === seeingId) : null;

  return (
    <div>
      {seeingArticle ? (
        <div className="Seeing">
          <h1>{seeingArticle.title}</h1>
          <small>by {seeingArticle.author}</small>
          <p>{seeingArticle.content}</p>
          <button onClick={() => setSeeingId(null)}>BACK</button>
        </div>
      ) : (
        <main className="homePage">
          <nav className="app-header">
          <h1>List of Articles</h1>
          <input
            type="text"
            placeholder="search for an author or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /></nav>
          <ul className="article-list">
            {filteredArticles.map(article => (
              <li key={article._id} className="article-item">
                <div className="article-text"><h2>{article.title}</h2>
                <p>{article.content.slice(0,30)+"..."}</p>
                <small>by {article.author}</small></div>
                <div className="article-actions">
                  <button className="menu-btn">⋮</button>
                  <div className="actions-dropdown">
                    <button onClick={() => setEditingId(article._id)}>✏️ Modify</button>
                    <button onClick={() => deleteArticle(article._id)}>🗑️ Delete</button>
                    <button onClick={() => getArticleById(article._id)}>👁️ See</button>
                  </div>
                </div>

                {editingId === article._id && (
                  <form className="edit-form" onSubmit={(e) => {
                    e.preventDefault();
                    const newTitle = e.target.title.value;
                    const newAuthor = e.target.author.value;
                    const newContent = e.target.content.value;
                    modifyArticle(article._id, newTitle, newAuthor, newContent);
                    setEditingId(null);
                  }}>
                    <input type="text" defaultValue={article.title} name="title" />
                    <input type="text" defaultValue={article.author} name="author" />
                    <textarea defaultValue={article.content} name="content"></textarea>
                    <button type="submit">Submit</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          {addingArticle? (
          <form onSubmit={addArticle} className="add-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <textarea
              placeholder="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="button" onClick={()=>setAddingArticle(false)}>BACK</button>
            <button type="submit">ADD</button>
          </form>) : (<button className="add-btn" onClick={()=>setAddingArticle(true)}>Add an article!!!</button>)}
        </main>
      )}
    </div>
  );
}

export default App;