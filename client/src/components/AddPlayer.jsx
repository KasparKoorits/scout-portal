import { Link, useNavigate } from "react-router-dom";
import AddPlayerForm from "./AddPlayerForm";

export default function AddPlayer() {
  const navigate = useNavigate();

  const handlePlayerAdded = (playerId) => {
    navigate("/", { 
      state: { 
        message: "Player added successfully!",
        playerId 
      } 
    });
  };

  return (
    <>
      <div className="topbar">
        <Link to="/" className="link">← Back</Link>
        <h1 style={{ margin: 0, fontSize: 20 }}>Add New Player</h1>
        <div style={{ width: 150 }} />
      </div>
      <AddPlayerForm onPlayerAdded={handlePlayerAdded} />
    </>
  );
}
