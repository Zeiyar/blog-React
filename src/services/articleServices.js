const API_URL = "https://blog-react-backend-3.onrender.com/articles";

export async function getArticles() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function addArticle(article,token){
    const res = await fetch(API_URL,{
        method:"POST",
        headers: {"Content-Type" : "application/json",Authorization:`Bearer ${token}`},
        body: JSON.stringify(article),
    });
    return res.json();
}

export async function modifyArticle(id,newArticle,token){
    const res = await fetch(`${API_URL}/${id}`,{
        method: "PUT",
        headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
        body: JSON.stringify(newArticle),
    });
    return res.json();
}

export async function deleteArticle(id,token){
    await fetch(`${API_URL}/${id}`,{
        method: "DELETE",
        headers:{Authorization:`Bearer ${token}`}
    })
}