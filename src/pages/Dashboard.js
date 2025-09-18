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

  const [disconnecta, setDisconnecta] = useState(false);
  const [myArticles, setMyArticles] = useState([]);
  const [seeingArticle, setSeeingArticle] = useState(null);

  // Charger les articles de l’utilisateur
  useEffect(() => {
    async function fetchData() {
      const articles = await getArticles();
      const mine = articles.filter((a) => a.author === username);
      setMyArticles(mine);
    }
    fetchData();
  }, [username]);

  // Déconnexion
  const disconnection = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  // CRUD
  const handleDelete = async (id) => {
    await deleteArticle(id, token);
    setMyArticles(myArticles.filter((a) => a._id !== id));
  };

  const handleAdd = async (article) => {
    const newArticle = await addArticle(article, token);
    setMyArticles([...myArticles, newArticle]);
  };

  const handleEdit = async (id, article) => {
    const updatedArticle = await modifyArticle(id, article, token);
    setMyArticles(myArticles.map((a) => (a._id === id ? updatedArticle : a)));
  };

  const handleView = (id) => {
    const seeing = myArticles.find((a) => a._id === id);
    setSeeingArticle(seeing);
  };

  // Si on affiche un seul article
  if (seeingArticle) {
    return <ArticleView article={seeingArticle} onBack={() => setSeeingArticle(null)} />;
  }

  return (
    <>
      <h1>Welcome Home {username} !!!</h1>
      <nav>
        <a href="#newStory">Create new story?!</a>
        <a href="#articles">Your Articles</a>
        <div>on work...</div>
      </nav>

      <div id="articles" className="myArticles">
        <ArticleList
          articles={myArticles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      <div id="newStory">
        <ArticleForm onSubmit={handleAdd} />
      </div>

      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => setDisconnecta(true)}>Disconnect?</button>

      {disconnecta && (
        <>
          <p>Are you sure ?</p>
          <button onClick={disconnection}>Yes</button>
          <button onClick={() => setDisconnecta(false)}>No</button>
        </>
      )}
    </>
  );
}

export default DashBoard;
