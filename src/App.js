import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from ("./pages/Home");
import Login from ("./pages/Login");
import Register from ("./pages/Register");
import DashBoard from ("./pages/Dashboard");

function App() {
  <Router>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<DashBoard />}/>
    </Routes>
  </Router>
}

export default App;