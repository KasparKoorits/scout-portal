CREATE USER IF NOT EXISTS 'scoutapp'@'localhost'
IDENTIFIED BY 'scoutpass';

GRANT ALL PRIVILEGES ON scouting_portal.* TO 'scoutapp'@'localhost';

FLUSH PRIVILEGES;

-- Use by doing sudo mysql < database/setup_user.sql
