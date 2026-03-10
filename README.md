# 🔍 Scout Portal
## Made by Kaspar Koorits and Jakob Kaur Kelder using Live Share.

A full-stack web application for football scouts to track and manage player information. Built with React, Node.js, Express, and MySQL.

## 📋 Overview

Scout Portal allows scouts to:
- Register and login with secure authentication
- Search for players across different clubs
- View detailed player profiles with statistics
- Add players to their personal dashboard for tracking
- Manage their tracked players

## 🛠️ Tech Stack

### Frontend
- **React** 19.2 - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server

### Backend
- **Node.js** with Express 5.2
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
scout-portal/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   └── styles/        # CSS files
│   └── package.json
│
├── server/          # Node.js backend
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Auth middleware
│   └── index.js          # Main server file
│
└── database/        # SQL scripts
    ├── schema.sql        # Database schema
    ├── seed_data.sql     # Sample data
    └── setup_user.sql    # User setup
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Database Setup

```bash
# Create database and tables
sudo mysql < database/schema.sql

# Set up database user
sudo mysql < database/setup_user.sql

# (Optional) Load sample data
sudo mysql < database/seed_data.sql
```

### 2. Server Setup

```bash
cd server
npm install
npm start
```

Server runs on: `http://localhost:3001`

### 3. Client Setup

```bash
cd client
npm install
npm run dev
```

Client runs on: `http://localhost:5173`

## 🔐 Authentication

The app uses JWT-based authentication:

### Register
```
POST /api/auth/register
Body: { "name": "John Smith", "email": "john@scout.com", "password": "password123" }
```

### Login
```
POST /api/auth/login
Body: { "email": "john@scout.com", "password": "password123" }
```

The API returns a JWT token that should be included in subsequent requests:
```
Authorization: Bearer <token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Players
- `GET /api/players?search=<query>` - Search players
- `GET /api/players/:id` - Get player details

### Dashboard
- `GET /api/dashboard/:scoutId` - Get scout's tracked players
- `POST /api/dashboard` - Add player to dashboard
- `DELETE /api/dashboard/:id` - Remove player from dashboard

## 🔧 Configuration

### Server Configuration
Located in `server/index.js`:
- Port: `3001`
- Database credentials: `scoutapp` / `scoutpass`
- JWT Secret: Set via `JWT_SECRET` environment variable

### Client Configuration
Located in `client/vite.config.js`:
- Dev server port: `5173`
- API proxy configuration

## 📝 Environment Variables

Create a `.env` file in the server directory:

```env
JWT_SECRET=your-super-secret-key-change-in-production
PORT=3001
DB_HOST=localhost
DB_USER=scoutapp
DB_PASSWORD=scoutpass
DB_NAME=scouting_portal
```

## 🧪 Development

### Run in Development Mode

```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm run dev
```

### Build for Production

```bash
cd client
npm run build
```

## 📦 Database Schema

### Main Tables
- **scout** - User accounts for scouts (name, email, password_hash)
- **player** - Player information (full_name, position, country, birth_date, etc.)
- **club** - Football clubs
- **player_stats** - Player statistics (matches_played, goals, assists)
- **scout_dashboard** - Tracks which players each scout is following

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `server/index.js`
- Ensure database and user exist

### Port Already in Use
- Change port in server or client config
- Kill existing process: `lsof -ti:3001 | xargs kill -9`

### CORS Issues
- Verify CORS is enabled in `server/index.js`
- Check client is making requests to correct API URL

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Happy Scouting! ⚽**
