function ArticleView (article,onBack){
    return (
    <div className="Seeing">
        <h1>{article.title}</h1>
        <small>by {article.author}</small>
        <p>{article.content}</p>
        <button onClick={onBack}>BACK</button>
    </div>)};

export default ArticleView;