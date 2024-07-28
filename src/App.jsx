import "./App.css";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";
import Meeting from "./pages/Meeting";
import Home from "./pages/Home"; // Assuming you have a Home page component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      <ToastContainer />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/meeting/:meetingId" element={<Meeting />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
