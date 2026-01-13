import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import PlayerView from "./components/PlayerView.jsx";
import AddPlayer from "./components/AddPlayer.jsx";

export default function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/player/:id" element={<PlayerView />} />
        <Route path="/add-player" element={<AddPlayer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
