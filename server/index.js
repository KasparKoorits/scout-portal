import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";
import { register, login } from "./controllers/authController.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Database error" });
};

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

app.get("/api/dashboard/:scoutId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.player_id, p.full_name, p.position, c.name AS club_name
       FROM scout_dashboard d
       JOIN player p ON p.player_id = d.player_id
       LEFT JOIN club c ON c.club_id = p.club_id
       WHERE d.scout_id = ?
       ORDER BY d.created_at DESC`,
      [Number(req.params.scoutId)]
    );
    res.json(rows);
  } catch (e) {
    handleError(res, e);
  }
});

app.get("/api/players", async (req, res) => {
  try {
    const q = (req.query.search || "").trim();
    const like = `%${q}%`;

    const [rows] = await pool.query(
      `SELECT p.player_id, p.full_name, p.position, c.name AS club_name
       FROM player p
       LEFT JOIN club c ON c.club_id = p.club_id
       WHERE ? = '' OR p.full_name LIKE ? OR c.name LIKE ? OR p.position LIKE ?
       ORDER BY p.full_name
       LIMIT 100`,
      [q, like, like, like]
    );
    res.json(rows);
  } catch (e) {
    handleError(res, e);
  }
});

app.get("/api/players/:id", async (req, res) => {
  try {
    const playerId = Number(req.params.id);

    const [playerRows] = await pool.query(
      `SELECT p.*, c.name AS club_name
       FROM player p
       LEFT JOIN club c ON c.club_id = p.club_id
       WHERE p.player_id = ?`,
      [playerId]
    );

    if (playerRows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const [statsRows] = await pool.query(
      `SELECT matches_played, goals, assists
       FROM player_stats
       WHERE player_id = ?`,
      [playerId]
    );

    const player = playerRows[0];
    if (player.market_value_eur) {
      player.market_value_eur = Number(player.market_value_eur);
    }

    res.json({
      player,
      stats: statsRows[0] || null,
    });
  } catch (e) {
    handleError(res, e);
  }
});

app.post("/api/dashboard/:scoutId", async (req, res) => {
  try {
    const scoutId = Number(req.params.scoutId);
    const playerId = Number(req.body.player_id);
    
    if (!playerId) {
      return res.status(400).json({ error: "player_id required" });
    }

    await pool.query(
      `INSERT IGNORE INTO scout_dashboard (scout_id, player_id) VALUES (?, ?)`,
      [scoutId, playerId]
    );

    res.json({ ok: true });
  } catch (e) {
    handleError(res, e);
  }
});

app.delete("/api/dashboard/:scoutId/:playerId", async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM scout_dashboard WHERE scout_id = ? AND player_id = ?`,
      [Number(req.params.scoutId), Number(req.params.playerId)]
    );
    res.json({ ok: true });
  } catch (e) {
    handleError(res, e);
  }
});

app.get("/api/clubs", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT club_id, name FROM club ORDER BY name`);
    res.json(rows);
  } catch (e) {
    handleError(res, e);
  }
});

app.post("/api/players", async (req, res) => {
  try {
    const {
      full_name,
      position,
      club_id,
      country,
      birth_date,
      height_cm,
      weight_kg,
      preferred_foot,
      market_value_eur,
    } = req.body;

    if (!full_name || !position) {
      return res.status(400).json({ error: "full_name and position are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO player (
        full_name, position, club_id, country, birth_date,
        height_cm, weight_kg, preferred_foot, market_value_eur
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        position,
        club_id || null,
        country || null,
        birth_date || null,
        height_cm || null,
        weight_kg || null,
        preferred_foot || null,
        market_value_eur || null,
      ]
    );

    const playerId = result.insertId;

    await pool.query(`INSERT INTO player_stats (player_id) VALUES (?)`, [playerId]);

    res.json({ ok: true, player_id: playerId });
  } catch (e) {
    handleError(res, e);
  }
});

app.delete("/api/players/:playerId", async (req, res) => {
  try {
    const playerId = Number(req.params.playerId);

    await pool.query(`DELETE FROM scout_dashboard WHERE player_id = ?`, [playerId]);
    await pool.query(`DELETE FROM player_stats WHERE player_id = ?`, [playerId]);
    const [result] = await pool.query(`DELETE FROM player WHERE player_id = ?`, [playerId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({ ok: true });
  } catch (e) {
    handleError(res, e);
  }
});

app.listen(PORT, () => {
  console.log(`✓ API running on http://localhost:${PORT}`);
});
