import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "scoutapp",
  password: process.env.DB_PASSWORD || "scoutpass",
  database: process.env.DB_NAME || "scouting_portal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
