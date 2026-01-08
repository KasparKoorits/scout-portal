import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const pool = mysql.createPool({
  host: "localhost",
  user: "scoutapp",
  password: "scoutpass",
  database: "scouting_portal",
});


app.get("/api/dashboard/:scoutId", async (req, res) => {
  try {
    const scoutId = Number(req.params.scoutId);
    const [rows] = await pool.query(
      `
      SELECT p.player_id, p.full_name, p.position, c.name AS club_name
      FROM scout_dashboard d
      JOIN player p ON p.player_id = d.player_id
      LEFT JOIN club c ON c.club_id = p.club_id
      WHERE d.scout_id = ?
      ORDER BY d.created_at DESC
      `,
      [scoutId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db error", detail: String(e.message || e) });
  }
});

app.get("/api/players", async (req, res) => {
  try {
    const q = (req.query.search || "").trim();
    const like = `%${q}%`;

    const [rows] = await pool.query(
      `
      SELECT p.player_id, p.full_name, p.position, c.name AS club_name
      FROM player p
      LEFT JOIN club c ON c.club_id = p.club_id
      WHERE (? = '' OR p.full_name LIKE ? OR c.name LIKE ? OR p.position LIKE ?)
      ORDER BY p.full_name
      LIMIT 50
      `,
      [q, like, like, like]
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db error", detail: String(e.message || e) });
  }
});

app.post("/api/dashboard/:scoutId", async (req, res) => {
  try {
    const scoutId = Number(req.params.scoutId);
    const playerId = Number(req.body.player_id);
    if (!playerId) return res.status(400).json({ error: "player_id required" });

    await pool.query(
      `INSERT IGNORE INTO scout_dashboard (scout_id, player_id) VALUES (?, ?)`,
      [scoutId, playerId]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db error", detail: String(e.message || e) });
  }
});

app.delete("/api/dashboard/:scoutId/:playerId", async (req, res) => {
  try {
    const scoutId = Number(req.params.scoutId);
    const playerId = Number(req.params.playerId);

    await pool.query(
      `DELETE FROM scout_dashboard WHERE scout_id = ? AND player_id = ?`,
      [scoutId, playerId]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db error", detail: String(e.message || e) });
  }
});

const server = app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
