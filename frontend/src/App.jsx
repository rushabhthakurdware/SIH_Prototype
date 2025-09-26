import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/login";
import RollingQR from "./pages/Teacher";
import Student from "./pages/Student";
import Admin from "./components/Admin";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return children;
};


const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/student"
            element={
              <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <Student />
              </div>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <RollingQR />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
