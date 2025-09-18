function ArticleList ({ articles, onEdit, onDelete, onView}){
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
    return (
        <ul className="article-list">
            {articles.map(article => (
              <li key={article._id} className="article-item">
                <div className="article-text">
                    <h2>{article.title}</h2>
                    <p>{article.content.slice(0,30)+"..." || "No content"}</p>
                    <small>by {article.author}</small>
                </div>

                <div className="article-actions">
                  <button className="menu-btn">⋮</button>
                  <div className="actions-dropdown">
                    <button onClick={() => {if(!token || (username !== article.author && role !== "admin")){alert("you need to connect before doing this")}else{onEdit(article)}}}>✏️ Modify</button>
                    <button onClick={() => {if(!token || (username !== article.author && role !== "admin")){alert("you need to connect before doing this")}else{onDelete(article._id)}}}>🗑️ Delete</button>
                    <button onClick={() => onView(article._id)}>👁️ See</button>
                  </div>
                </div>
            </li>
            ))}
        </ul>
    )
}

export default ArticleList;