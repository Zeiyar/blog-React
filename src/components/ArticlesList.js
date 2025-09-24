import DOMPurify from "dompurify";

function ArticleList ({ articles, onEdit, onDelete, onView}){
    return (
        <ul className="article-list">
            {articles.map(article => (
              <li key={article._id} className="article-item">
                <div className="article-text">
                    <h2>{article.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content.slice(0,30)+"...")}}/>
                    <small>by {article.author}</small>
                </div>
                
                <div className="article-actions">
                  <small className="date">{new Date(article.updatedAt).toLocaleString()}</small>
                  <button className="menu-btn">⋮</button>
                  <div className="actions-dropdown">
                    <button onClick={() => onEdit(article)}>✏️ Modify</button>
                    <button onClick={() => onDelete(article)}>🗑️ Delete</button>
                    <button onClick={() => onView(article._id)}>👁️ See</button>
                  </div>
                </div>
            </li>
            ))}
        </ul>
    )
}

export default ArticleList;