USE scouting_portal;

-- =====================
-- CLEAN OLD DATA
-- =====================
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE scout_dashboard;
TRUNCATE TABLE player_stats;
TRUNCATE TABLE player;
TRUNCATE TABLE club;
TRUNCATE TABLE scout;
SET FOREIGN_KEY_CHECKS=1;

-- =====================
-- SCOUTS (with hashed passwords)
-- =====================
-- Password for all demo scouts is 'password123'
-- In production, users should register their own accounts with secure passwords
INSERT INTO scout (name, email, password_hash) VALUES
('John Smith', 'john@scout.com', '$2b$10$rXKvHHKL7fz3Nq5Y7Zx8eOZ0qG9P8Y5X3J7V1W2K4M6N8P0R2T4V6'),
('Maria Garcia', 'maria@scout.com', '$2b$10$rXKvHHKL7fz3Nq5Y7Zx8eOZ0qG9P8Y5X3J7V1W2K4M6N8P0R2T4V6'),
('David Lee', 'david@scout.com', '$2b$10$rXKvHHKL7fz3Nq5Y7Zx8eOZ0qG9P8Y5X3J7V1W2K4M6N8P0R2T4V6');

-- =====================
-- CLUBS
-- =====================
INSERT INTO club (name) VALUES
('FC Barcelona'),
('Real Madrid'),
('Atlético Madrid'),
('Manchester City'),
('Liverpool'),
('Arsenal'),
('Paris Saint-Germain'),
('Inter Milan'),
('AC Milan'),
('Juventus'),
('Bayern Munich'),
('Borussia Dortmund'),
('Benfica'),
('Ajax'),
('Inter Miami');

-- =====================
-- PLAYERS (ALL FIELDS)
-- =====================
INSERT INTO player
(club_id, full_name, position, country, birth_date, height_cm, weight_kg, preferred_foot, market_value_eur, photo_url)
VALUES
-- Barcelona
((SELECT club_id FROM club WHERE name='FC Barcelona'),'Lamine Yamal','FW','Spain','2007-07-13',180,72,'Left',90000000,NULL),
((SELECT club_id FROM club WHERE name='FC Barcelona'),'Pedri','MF','Spain','2002-11-25',174,60,'Right',100000000,NULL),
((SELECT club_id FROM club WHERE name='FC Barcelona'),'Gavi','MF','Spain','2004-08-05',173,70,'Right',90000000,NULL),
((SELECT club_id FROM club WHERE name='FC Barcelona'),'Robert Lewandowski','FW','Poland','1988-08-21',185,81,'Right',15000000,NULL),

-- Real Madrid
((SELECT club_id FROM club WHERE name='Real Madrid'),'Jude Bellingham','MF','England','2003-06-29',186,75,'Right',180000000,NULL),
((SELECT club_id FROM club WHERE name='Real Madrid'),'Vinícius Júnior','FW','Brazil','2000-07-12',176,73,'Right',150000000,NULL),
((SELECT club_id FROM club WHERE name='Real Madrid'),'Kylian Mbappé','FW','France','1998-12-20',178,73,'Right',180000000,NULL),

-- Man City
((SELECT club_id FROM club WHERE name='Manchester City'),'Erling Haaland','FW','Norway','2000-07-21',195,94,'Left',180000000,NULL),
((SELECT club_id FROM club WHERE name='Manchester City'),'Kevin De Bruyne','MF','Belgium','1991-06-28',181,70,'Right',45000000,NULL),

-- Liverpool
((SELECT club_id FROM club WHERE name='Liverpool'),'Mohamed Salah','FW','Egypt','1992-06-15',175,71,'Left',65000000,NULL),
((SELECT club_id FROM club WHERE name='Liverpool'),'Virgil van Dijk','DF','Netherlands','1991-07-08',193,92,'Right',40000000,NULL),

-- Arsenal
((SELECT club_id FROM club WHERE name='Arsenal'),'Bukayo Saka','FW','England','2001-09-05',178,65,'Left',120000000,NULL),
((SELECT club_id FROM club WHERE name='Arsenal'),'Martin Ødegaard','MF','Norway','1998-12-17',178,68,'Left',90000000,NULL),

-- PSG
((SELECT club_id FROM club WHERE name='Paris Saint-Germain'),'Ousmane Dembélé','FW','France','1997-05-15',178,67,'Right',50000000,NULL),

-- Italy
((SELECT club_id FROM club WHERE name='Inter Milan'),'Lautaro Martínez','FW','Argentina','1997-08-22',174,72,'Right',110000000,NULL),
((SELECT club_id FROM club WHERE name='AC Milan'),'Rafael Leão','FW','Portugal','1999-06-10',188,81,'Right',90000000,NULL),
((SELECT club_id FROM club WHERE name='Juventus'),'Dušan Vlahović','FW','Serbia','2000-01-28',190,84,'Left',75000000,NULL),

-- Germany
((SELECT club_id FROM club WHERE name='Bayern Munich'),'Harry Kane','FW','England','1993-07-28',188,86,'Right',90000000,NULL),
((SELECT club_id FROM club WHERE name='Borussia Dortmund'),'Jadon Sancho','FW','England','2000-03-25',180,76,'Right',45000000,NULL),

-- MLS
((SELECT club_id FROM club WHERE name='Inter Miami'),'Lionel Messi','FW','Argentina','1987-06-24',170,72,'Left',35000000,NULL);

-- =====================
-- PLAYER STATS
-- =====================
INSERT INTO player_stats (player_id, matches_played, goals, assists)
SELECT player_id, 0, 0, 0 FROM player;


-- Give everyone realistic-ish current season stats
UPDATE player_stats
SET
  matches_played = FLOOR(1 + RAND()*25),
  goals = 0,
  assists = 0;

-- For forwards: more goals
UPDATE player_stats ps
JOIN player p ON p.player_id = ps.player_id
SET
  goals = FLOOR(RAND() * LEAST(20, ps.matches_played)),
  assists = FLOOR(RAND() * LEAST(12, ps.matches_played))
WHERE p.position = 'FW';

-- For midfielders: more assists
UPDATE player_stats ps
JOIN player p ON p.player_id = ps.player_id
SET
  goals = FLOOR(RAND() * LEAST(10, ps.matches_played)),
  assists = FLOOR(RAND() * LEAST(15, ps.matches_played))
WHERE p.position = 'MF';

-- For defenders: low goals/assists
UPDATE player_stats ps
JOIN player p ON p.player_id = ps.player_id
SET
  goals = FLOOR(RAND() * LEAST(4, ps.matches_played)),
  assists = FLOOR(RAND() * LEAST(6, ps.matches_played))
WHERE p.position = 'DF';

-- For keepers: usually 0/0
UPDATE player_stats ps
JOIN player p ON p.player_id = ps.player_id
SET goals = 0, assists = 0
WHERE p.position = 'GK';
