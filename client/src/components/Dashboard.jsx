import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API = "http://localhost:3001";
const SCOUT_ID = 1;

export default function Dashboard() {
  const [tracked, setTracked] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const location = useLocation();

  const trackedSet = useMemo(() => new Set(tracked.map(p => p.player_id)), [tracked]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setStatus(location.state.message);
      if (location.state.playerId) addPlayer(location.state.playerId);
      setTimeout(() => setStatus(""), 5000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  async function loadData() {
    try {
      const [t, r] = await Promise.all([
        fetch(`${API}/api/dashboard/${SCOUT_ID}`).then(res => res.json()),
        fetch(`${API}/api/players`).then(res => res.json())
      ]);
      setTracked(t);
      setResults(r);
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  }

  async function searchPlayers(query) {
    try {
      const res = await fetch(`${API}/api/players?search=${encodeURIComponent(query)}`);
      setResults(await res.json());
    } catch (e) {
      setStatus("Search failed");
    }
  }

  async function addPlayer(playerId) {
    try {
      await fetch(`${API}/api/dashboard/${SCOUT_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: playerId }),
      });
      const t = await fetch(`${API}/api/dashboard/${SCOUT_ID}`).then(res => res.json());
      setTracked(t);
    } catch (e) {
      setStatus("Add failed");
    }
  }

  async function removePlayer(playerId) {
    try {
      await fetch(`${API}/api/dashboard/${SCOUT_ID}/${playerId}`, { method: "DELETE" });
      setTracked(tracked.filter(p => p.player_id !== playerId));
    } catch (e) {
      setStatus("Remove failed");
    }
  }

  async function deletePlayerPermanently(playerId, playerName) {
    if (!window.confirm(`Permanently delete "${playerName}"?\n\nThis will remove the player from all scouts' dashboards and cannot be undone.`)) return;

    try {
      const res = await fetch(`${API}/api/players/${playerId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      
      setTracked(tracked.filter(p => p.player_id !== playerId));
      setResults(results.filter(p => p.player_id !== playerId));
      setStatus(`"${playerName}" deleted`);
      setTimeout(() => setStatus(""), 3000);
    } catch (e) {
      setStatus(`Delete failed: ${e.message}`);
    }
  }

  return (
    <>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0 }}>Scout Dashboard</h1>
            {status && <p style={{ margin: "6px 0 0", opacity: 0.8 }}>{status}</p>}
          </div>
          <Link to="/add-player">
            <button style={{ padding: "12px 24px", fontSize: "16px", fontWeight: 600 }}>
              + Add Player
            </button>
          </Link>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>My Players ({tracked.length})</h2>
          {tracked.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No players yet. Add players from the list →</p>
          ) : (
            tracked.map(p => (
              <div className="row" key={p.player_id}>
                <Link to={`/player/${p.player_id}`} style={{ textDecoration: "none", color: "inherit", flex: 1 }}>
                  <div>
                    <strong>{p.full_name}</strong>
                    <div style={{ opacity: 0.8, fontSize: 13 }}>{p.position} • {p.club_name ?? "—"}</div>
                  </div>
                </Link>
                <button onClick={() => removePlayer(p.player_id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>All Players</h2>
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              searchPlayers(e.target.value);
            }}
            placeholder="Search by name, club, or position..."
          />

          <div style={{ height: 12 }} />

          {results.map(p => (
            <div className="row" key={p.player_id}>
              <Link to={`/player/${p.player_id}`} style={{ textDecoration: "none", color: "inherit", flex: 1 }}>
                <div>
                  <strong>{p.full_name}</strong>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>{p.position} • {p.club_name ?? "—"}</div>
                </div>
              </Link>
              <div style={{ display: "flex", gap: 8 }}>
                <button 
                  disabled={trackedSet.has(p.player_id)} 
                  onClick={() => addPlayer(p.player_id)}
                >
                  {trackedSet.has(p.player_id) ? "✓" : "Add"}
                </button>
                <button 
                  onClick={() => deletePlayerPermanently(p.player_id, p.full_name)}
                  style={{ backgroundColor: "#dc2626", color: "white", border: "1px solid #b91c1c" }}
                  title="Delete permanently"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
