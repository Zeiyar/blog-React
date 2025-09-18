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
                    <p>{article.content.slice(0,30)+"..."}</p>
                    <small>by {article.author}</small>
                </div>

                <div className="article-actions">
                  <button className="menu-btn">⋮</button>
                  <div className="actions-dropdown">
                    <button onClick={() => onEdit(article)} disabled={!token || (username !== article.author && role !== admin)}>✏️ Modify</button>
                    <button onClick={() => onDelete(article._id)} disabled={!token || (username !== article.author && role !== admin)}>🗑️ Delete</button>
                    <button onClick={() => onView(article._id)}>👁️ See</button>
                  </div>
                </div>
            </li>
            ))}
        </ul>
    )
}

export default ArticleList;