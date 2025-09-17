import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/login"
import Register from "./pages/register"
import DashBoard from "./pages/dashboard"

function App() {
  <Router>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<DashBoard />}/>
    </Routes>
  </Router>
}

export default App;