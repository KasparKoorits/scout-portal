import { pool } from "../config/db.js";

const User = {
  findByUsername: async (username) => {
    const [rows] = await pool.query(
      "SELECT scout_id, name, email, password_hash, username FROM scout WHERE username = ? OR email = ?",
      [username, username]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  create: async ({ username, password_hash, email, name }) => {
    const [result] = await pool.query(
      "INSERT INTO scout (username, name, email, password_hash) VALUES (?, ?, ?, ?)",
      [username, name, email, password_hash]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT scout_id, name, email, username FROM scout WHERE scout_id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
};

export default User;
