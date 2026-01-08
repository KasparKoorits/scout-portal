USE scouting_portal;

INSERT INTO scout (name, email) VALUES ('Demo Scout', 'demo@demo.com');
INSERT INTO club (name) VALUES ('Demo FC');

INSERT INTO player (club_id, full_name, position, country, birth_date, height_cm, weight_kg, preferred_foot, market_value_eur)
VALUES (1, 'Marcus Silva', 'Forward', 'Brazil', '2002-08-14', 183, 78, 'Right', 45000000);

INSERT INTO player_stats (player_id, matches_played, goals, assists)
VALUES (1, 24, 18, 7);

-- Use by doing sudo mysql < database/seed.sql