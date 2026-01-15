import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PlayerView from "./components/PlayerView.jsx";
import AddPlayer from "./components/AddPlayer.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { login } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route path="/register" element={<Register onLogin={login} />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="container">
              <Dashboard />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/player/:id"
        element={
          <ProtectedRoute>
            <div className="container">
              <PlayerView />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-player"
        element={
          <ProtectedRoute>
            <div className="container">
              <AddPlayer />
            </div>
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
