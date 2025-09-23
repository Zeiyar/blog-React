import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, deleteArticle, modifyArticle } from "../services/articleServices";
import ArticleList from "../components/ArticlesList";
import ArticleForm from "../components/ArticleForm";
import ArticleView from "../components/ArticleView";

function Home() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [seeingArticle, setSeeingArticle] = useState(null);
  const [addingArticle, setAddingArticle] = useState(true);
  const [search, setSearch] = useState(""); 
  const role = localStorage.getItem("role");

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

/*  const handleAdd = async (article) => {
    const newArticle = await addArticle(article, token);
    setArticles([...articles, newArticle]);
    setAddingArticle(false);
    navigate("/")
  };*/

  const handleDelete = async (id) => {
    const article = articles.filter((a) => a._id === id);
    if(!token || (username !== article.author && role !== "admin")){alert("that's not your article")}else{
    await deleteArticle(id, token);
    setArticles(articles.filter((a) => a._id !== id))};
  };

  const handleEdit = async (id, updatedData) => {
    const article = articles.filter((a) => a._id === id);
    if(!token || (username !== article.author && role !== "admin")){alert("that's not your article")}else{
    const updatedArticle = await modifyArticle(id, updatedData, token);
    setArticles(articles.map((a) => (a._id === id ? updatedArticle : a)));
    setEditingArticle(null);
    navigate("/")};
  };

  const handleView = (id) => {
    const seeing = articles.find((a) => a._id === id);
    setSeeingArticle(seeing);
  };

  const filteredArticles = search
    ? articles.filter(
        (a) =>
          a.author.toLowerCase().includes(search.toLowerCase()) ||
          a.title.toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  if (seeingArticle) {
    return <ArticleView article={seeingArticle} onBack={() => setSeeingArticle(null)} />;
  }

  if (editingArticle) {
    return (
      <ArticleForm
        initialData={editingArticle}
        onSubmit={(data) => {handleEdit(editingArticle._id, data);
            setEditingArticle(null);}
        }
        onCancel={() => setEditingArticle(null)}
      />
    );
  }

//  if (addingArticle) {
 //   return <ArticleForm onSubmit={handleAdd} onCancel={() => setAddingArticle(false)} />;
  //}

  return (
    <div>
      <header>
        <nav className="app-header">
          <h1>Reablog in the filled Hollow</h1>
          {username&&<h2 className="usernameh2">even if we tried we couldn't stop {username}</h2>}
          <input
            type="text"
            placeholder="search for an author or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </nav>
        
      </header>

      <main className="homePage">
        <ArticleList
          articles={filteredArticles}
          onDelete={handleDelete}
          onEdit={setEditingArticle}
          onView={handleView}
        />

        <button className="add-btn" onClick={() => {if(!username){
          setAddingArticle(false);
          setTimeout(()=>{navigate("/login")},2000)}
          else{
            setAddingArticle(true);
            navigate("/dashboard")}}}>
          {addingArticle ? "Add an article!!!" : "you are not connected you need to connect to had articles you will be redirected"}
        </button>
      </main>
    </div>
  );
}

export default Home;