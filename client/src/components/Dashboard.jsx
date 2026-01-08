import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:3001";
const scoutId = 1; // login later

export default function Dashboard() {
  const [tracked, setTracked] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Loading…");

  const trackedSet = useMemo(() => new Set(tracked.map((p) => p.player_id)), [tracked]);

  async function loadTracked() {
    const res = await fetch(`${API}/api/dashboard/${scoutId}`);
    if (!res.ok) throw new Error("Dashboard load failed");
    return res.json();
  }

  async function loadResults(q) {
    const res = await fetch(`${API}/api/players?search=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error("Player search failed");
    return res.json();
  }

  useEffect(() => {
    (async () => {
      try {
        // test server quickly
        const health = await fetch(`${API}/api/health`);
        if (!health.ok) throw new Error("API not reachable");

        const [t, r] = await Promise.all([loadTracked(), loadResults("")]);
        setTracked(t);
        setResults(r);
        setStatus("OK");
      } catch (e) {
        setStatus(`API error: ${e.message}`);
      }
    })();
  }, []);

  async function addPlayer(playerId) {
    try {
      setStatus("Adding…");
      await fetch(`${API}/api/dashboard/${scoutId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: playerId }),
      });
      const t = await loadTracked();
      setTracked(t);
      setStatus("OK");
    } catch {
      setStatus("Add failed");
    }
  }

  async function removePlayer(playerId) {
    try {
      setStatus("Removing…");
      await fetch(`${API}/api/dashboard/${scoutId}/${playerId}`, { method: "DELETE" });
      const t = await loadTracked();
      setTracked(t);
      setStatus("OK");
    } catch {
      setStatus("Remove failed");
    }
  }

  return (
    <>
      <div className="card">
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <p style={{ margin: "6px 0 0", opacity: 0.8 }}>Scout #{scoutId} • Status: {status}</p>
      </div>

      <div className="grid">
        <div className="card">
          <h2>My Players</h2>
          {tracked.length === 0 ? (
            <p style={{ opacity: 0.8 }}>Empty dashboard — add players on the right.</p>
          ) : (
            tracked.map((p) => (
              <div className="row" key={p.player_id}>
                <div>
                  <div><strong>{p.full_name}</strong></div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>{p.position} • {p.club_name ?? "—"}</div>
                </div>
                <button onClick={() => removePlayer(p.player_id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>Add Players</h2>
          <input
            value={search}
            onChange={async (e) => {
              const v = e.target.value;
              setSearch(v);
              try {
                const r = await loadResults(v);
                setResults(r);
              } catch {
                setStatus("Search failed");
              }
            }}
            placeholder="Search players…"
          />

          <div style={{ height: 12 }} />

          {results.map((p) => (
            <div className="row" key={p.player_id}>
              <div>
                <div><strong>{p.full_name}</strong></div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>{p.position} • {p.club_name ?? "—"}</div>
              </div>
              <button disabled={trackedSet.has(p.player_id)} onClick={() => addPlayer(p.player_id)}>
                {trackedSet.has(p.player_id) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
