import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage"; 
import ConfirmacaoEmailPage from "./pages/CofirmacaoEmailPage";
import RegisterPage from "./pages/RegisterPage";
import ConfirmacaoEmailCode from "./pages/ConfirmacaoEmailCode";
import Home from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirmacaoEmail" element={<ConfirmacaoEmailPage />} />
        <Route path="/confirmacaoEmailCode" element={<ConfirmacaoEmailCode />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
