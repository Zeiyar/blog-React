import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ArticleList from "../components/ArticlesList";
import ArticleForm from "../components/ArticleForm";
import ArticleView from "../components/ArticleView";
import { addArticle, deleteArticle, modifyArticle, getArticles } from "../services/articleServices";

function DashBoard() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [editingArticle, setEditingArticle] = useState(null);
  const [disconnecta, setDisconnecta] = useState(false);
  const [myArticles, setMyArticles] = useState([]);
  const [seeingArticle, setSeeingArticle] = useState(null);
  const [dark,setDark] = useState(JSON.parse(localStorage.getItem("darker")) || false);

  // Charger les articles de l’utilisateur
  useEffect(() => {
    async function fetchData() {
      const data = await getArticles();
      const mine = data.articles.filter((a) => a.author === username);
      setMyArticles(mine);
    }
    fetchData();
  }, [username]);

  useEffect(() => {
  if (dark) {
    document.body.classList.add("hollow-dark");
  } else {
    document.body.classList.remove("hollow-dark");
  }
  localStorage.setItem("darker", JSON.stringify(dark));
}, [dark]);


  // Déconnexion
  const disconnection = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  // CRUD
  const handleDelete = async (article) => {
    if (!token) {
      alert("you need to reconnect...");
      return navigate("/login");
    }
    try {
      const res = await deleteArticle(article._id, token);
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.message || "You can't delete this article");
        return;
      }
  
      setMyArticles(myArticles.filter(a => a._id !== article._id));
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("You can't delete this article");
    }
  };

  const handleAdd = async (article) => {
    if (!token) {
      alert("you need to reconnect...");
      return navigate("/login");
    }
    const newArticle = await addArticle(article, token);
    setMyArticles([...myArticles, newArticle]);
  };

  const handleEdit = async (id, updatedData) => {
    if (!token) {
      alert("you need to reconnect...");
      return navigate("/login");
    }
    const updatedArticle = await modifyArticle(id, updatedData, token);
    setMyArticles(myArticles.map((a) => (a._id === id ? updatedArticle : a)));
    setEditingArticle(null);
    navigate("/dashboard");
  };

  const handleView = (id) => {
    const seeing = myArticles.find((a) => a._id === id);
    setSeeingArticle(seeing);
  };

  // Si on affiche un seul article
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
    <>
      
      <nav className="navDashboard">
        <a href="#newStory">Create new story?!</a>
        <a href="#articles">Your Articles</a>
        <a href="#settings">Settings</a>
      </nav>

    <main className="dash"><h1>Welcome Home {username} !!!</h1>
      <div id="articles" className="myArticles">
        <ArticleList
          articles={myArticles}
          onEdit={setEditingArticle}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      <div id="newStory">
        <ArticleForm onSubmit={handleAdd} />
      </div>

      <button className="options" onClick={() => setDark(!dark)}>
      {dark ? "Brighter ?" : "Darker ?"}
      </button>
      <button className="options" onClick={() => navigate("/")}>Home</button>
      <button className="options" onClick={() => setDisconnecta(true)}>Disconnect?</button>

      {disconnecta && (
        <div>
          <p>Are you sure ?</p>
          <button onClick={disconnection}>Yes</button>
          <button onClick={() => setDisconnecta(false)}>No</button>
        </div>
      )}
      </main>
    </>
  );
}

export default DashBoard;
