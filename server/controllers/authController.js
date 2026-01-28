import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const scoutId = await User.create({ name, email, password_hash });

    const token = jwt.sign({ scoutId, email }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({ 
      message: "User registered successfully!",
      token,
      scout: { scout_id: scoutId, name, email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ scoutId: user.scout_id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ 
      token,
      scout: {
        scout_id: user.scout_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during login" });
  }
};
