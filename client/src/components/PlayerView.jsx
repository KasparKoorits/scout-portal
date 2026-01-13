import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:3001";

const StatBox = ({ label, value }) => (
  <div className="statBox">
    <div className="statValue">{value ?? "—"}</div>
    <div className="statLabel">{label}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="infoRow">
    <div className="muted">{label}</div>
    <div>{value ?? "—"}</div>
  </div>
);

const calculateAge = (birthDate) => {
  if (!birthDate) return "—";
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function PlayerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlayer();
  }, [id]);

  async function loadPlayer() {
    try {
      const res = await fetch(`${API}/api/players/${id}`);
      if (!res.ok) throw new Error("Player not found");
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    }
  }

  async function deletePlayer() {
    if (!window.confirm(`Permanently delete "${data?.player?.full_name}"?\n\nThis action cannot be undone.`)) return;

    try {
      const res = await fetch(`${API}/api/players/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      
      navigate("/", { 
        state: { message: `"${data.player.full_name}" deleted` } 
      });
    } catch (e) {
      setError(e.message);
    }
  }

  if (error) {
    return (
      <>
        <div className="topbar">
          <Link className="link" to="/">← Back</Link>
        </div>
        <div className="card">
          <h1 style={{ margin: 0 }}>Error</h1>
          <p className="muted" style={{ marginTop: 8 }}>{error}</p>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <div className="topbar">
          <Link className="link" to="/">← Back</Link>
        </div>
        <div className="card">
          <p className="muted">Loading...</p>
        </div>
      </>
    );
  }

  const { player, stats } = data;

  return (
    <>
      <div className="topbar">
        <Link className="link" to="/">← Back</Link>
        <button 
          onClick={deletePlayer}
          style={{ 
            backgroundColor: "#dc2626", 
            color: "white",
            border: "1px solid #b91c1c",
            padding: "8px 16px",
            fontSize: 14
          }}
        >
          Delete Player
        </button>
      </div>

      <div className="card headerCard">
        <div className="avatar">
          {player.photo_url ? (
            <img src={player.photo_url} alt={player.full_name} />
          ) : (
            <div className="avatarPlaceholder">?</div>
          )}
        </div>

        <div className="headerInfo">
          <div className="nameRow">
            <h1 className="title" style={{ margin: 0 }}>{player.full_name}</h1>
            <span className="pill">{player.position}</span>
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            {player.club_name ?? "—"} • {player.country ?? "—"}
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2 className="sectionTitle">About</h2>
          <div className="stack">
            <Row label="Age" value={calculateAge(player.birth_date)} />
            <Row label="Height" value={player.height_cm ? `${player.height_cm} cm` : "—"} />
            <Row label="Weight" value={player.weight_kg ? `${player.weight_kg} kg` : "—"} />
            <Row label="Preferred Foot" value={player.preferred_foot} />
            <Row label="Market Value" value={formatCurrency(player.market_value_eur)} />
          </div>
        </div>

        <div className="card">
          <div className="sectionHeader">
            <h2 className="sectionTitle" style={{ margin: 0 }}>Statistics</h2>
            <span className="muted small">Season stats</span>
          </div>
          <div className="statsGrid">
            <StatBox label="Goals" value={stats?.goals ?? 0} />
            <StatBox label="Assists" value={stats?.assists ?? 0} />
            <StatBox label="Matches" value={stats?.matches_played ?? 0} />
          </div>
        </div>
      </div>
    </>
  );
}
