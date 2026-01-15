import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "scoutapp",
  password: "scoutpass",
  database: "scouting_portal",
});
