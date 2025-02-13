import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application
const PORT = process.env.PORT || 8747; // Define the port number (from environment variables or default 8747)
const DATABASE_URL = process.env.DATABASE_URL; // Load MongoDB connection string from environment variables

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.ORIGIN, // Allow requests only from this frontend domain (defined in .env)
    credentials: true, // Allow cookies and authentication headers in cross-origin requests
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose
  .connect(DATABASE_URL) // Connect to the database using the URL from environment variables
  .then(() => console.log("MongoDB connected successfully")) // Log success message
  .catch((err) => console.error("MongoDB connection error:", err)); // Log error if connection fails

// Define a user schema for MongoDB
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email is required and must be unique
  password: { type: String, required: true }, // Password is required
});

// Create a Mongoose model for the "users" collection
const User = mongoose.model("User", userSchema);

// API endpoint for user signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    console.log("Received signup request:", req.body); // Log incoming request body

    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user document
    const newUser = new User({ email, password });
    const savedUser = await newUser.save(); // Save the user to MongoDB

    console.log("User saved successfully:", savedUser);
    res.status(201).json({ message: "User registered successfully" }); // Send success response
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
});

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
