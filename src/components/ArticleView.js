function ArticleView ({article,onBack}){
    return (
    <div className="Seeing">
        <h1>{article.title}</h1>
        <small>by {article.author}</small>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content)}}/>
        <button onClick={onBack}>BACK</button>
    </div>)};

export default ArticleView;