import { pool } from "../config/db.js";

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT scout_id, name, email, password_hash FROM scout WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  create: async ({ name, email, password_hash }) => {
    const [result] = await pool.query(
      "INSERT INTO scout (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );
    return result.insertId;
  }
};

export default User;
