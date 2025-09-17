function ArticleList ({ articles, onEdit, onDelete, onView}){
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
                    <button onClick={() => onEdit(article._id)}>✏️ Modify</button>
                    <button onClick={() => onDelete(article._id)}>🗑️ Delete</button>
                    <button onClick={() => onView(article._id)}>👁️ See</button>
                  </div>
                </div>
            </li>
            ))}
        </ul>
    )
}

export default ArticleList;