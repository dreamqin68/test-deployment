import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create the Express application, but do NOT listen here
const app = express();

// Use environment variables or defaults
// (We'll handle the DB connection in a function below)
const ORIGIN = process.env.ORIGIN;

// Middleware
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Define a user schema and model (same as your original code)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
export const User = mongoose.model("User", userSchema);

// Signup controller
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ email, password });
    await newUser.save(); // Save to MongoDB

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Define routes
const authRoutes = Router();
authRoutes.post("/signup", signup);
app.use("/api/auth", authRoutes);

/**
 * connectDB:
 * A helper to connect to MongoDB. We'll call this in index.js (for real use)
 * and in tests (for in-memory or environment-based DB).
 */
export async function connectDB(uri) {
  return mongoose.connect(uri);
}

/**
 * Export the `app` so other files (like index.js or test files) can import it.
 * We also export the `User` model if tests need it.
 */
export { app };
