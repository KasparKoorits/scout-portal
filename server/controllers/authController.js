import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const register = async (req, res) => {
  const { username, password, email, name } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findByUsername(username);
    
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = await User.create({ 
      username, 
      password_hash,
      email: email || null,
      name: name || username
    });

    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ 
      auth: true,
      token,
      user: { id: userId, username, name: name || username }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const user = await User.findByUsername(username);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.scout_id, username: user.username || user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ 
      auth: true, 
      token,
      user: {
        id: user.scout_id,
        username: user.username || user.email,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during login" });
  }
};
