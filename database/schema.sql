-- Use by doing sudo mysql < database/schema.sql

CREATE DATABASE IF NOT EXISTS scouting_portal;
USE scouting_portal;

CREATE TABLE IF NOT EXISTS club (
  club_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS scout (
  scout_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player (
  player_id INT AUTO_INCREMENT PRIMARY KEY,
  club_id INT,
  full_name VARCHAR(120) NOT NULL,
  position VARCHAR(30) NOT NULL,
  country VARCHAR(80),
  birth_date DATE,
  height_cm INT,
  weight_kg INT,
  preferred_foot VARCHAR(10),
  market_value_eur DECIMAL(12,2),
  photo_url VARCHAR(255),
  FOREIGN KEY (club_id) REFERENCES club(club_id)
);

CREATE TABLE IF NOT EXISTS player_stats (
  stats_id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL UNIQUE,
  matches_played INT DEFAULT 0,
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  FOREIGN KEY (player_id) REFERENCES player(player_id)
);

CREATE TABLE IF NOT EXISTS scout_dashboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scout_id INT NOT NULL,
  player_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (scout_id) REFERENCES scout(scout_id),
  FOREIGN KEY (player_id) REFERENCES player(player_id),
  UNIQUE (scout_id, player_id)
);
