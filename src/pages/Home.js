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


  const handleDelete = async (article) => {
  if (!token || (username !== article.author && role !== "admin")) {
    alert("that's not your article");
    return;
  }

  try {
    const res = await deleteArticle(article._id, token);
    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Impossible de supprimer l'article");
      return;
    }

    setArticles(articles.filter((a) => a._id !== article._id));
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la suppression");
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
      alert("Vous n'avez pas la permission");
      return;
    }
    setArticles(articles.map(a => (a._id === id ? updatedArticle : a)));
    setEditingArticle(null);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la modification");
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