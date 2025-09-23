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

  const handleDelete = async (article) => {
  if (!token) {
    alert("You must be logged in");
    return;
  }

  try {
    const res = await deleteArticle(article._id, token);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "You can't delete this article");
      return;
    }

    setArticles(articles.filter(a => a._id !== article._id));
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("You can't delete this article");
  }
};


  const handleStartEdit = (article) => {
    if (!token || (username !== article.author && role !== "admin")) {
      alert("That's not your article");
    } else {
      setEditingArticle(article);
    }
  };

  const handleEdit = async (id, updatedData) => {
  try {
    const updatedArticle = await modifyArticle(id, updatedData, token);
    if (!updatedArticle) {
      alert("You can't modify this article");
      return;
    }
    setArticles(articles.map(a => (a._id === id ? updatedArticle : a)));
    setEditingArticle(null);
  } catch (err) {
    console.error(err);
    alert("You can't modify this article");
  }
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
          onEdit={handleStartEdit}
          onView={handleView}
        />

        <button className="add-btn" onClick={() => {if(!username){
          setAddingArticle(false);
          setTimeout(()=>{navigate("/login")},2000)}
          else{
            setAddingArticle(true);
            navigate("/dashboard")}}}>
          {addingArticle ? "Add an article!!!" : "You are not connected you need to connect to had articles you will be redirected"}
        </button>
      </main>
    </div>
  );
}

export default Home;