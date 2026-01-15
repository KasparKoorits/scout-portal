import { pool } from "../config/db.js";

const User = {
  findByUsername: async (username) => {
    const [rows] = await pool.query(
      "SELECT scout_id, name, email, password_hash, username FROM scout WHERE username = ?",
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  create: async ({ username, password_hash }) => {
    const [result] = await pool.query(
      "INSERT INTO scout (username, name, password_hash) VALUES (?, ?, ?)",
      [username, username, password_hash]
    );
    return result.insertId;
  }
};

export default User;
