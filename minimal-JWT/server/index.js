import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Library for securely hashing passwords

// Secret key for signing JWT tokens,it can be random string
const SECRET_KEY = "mySuperSecretKey";

// Salt rounds for bcrypt hashing (higher is more secure but slower)
const SALT_ROUNDS = 10;

// Port where the server will listen for requests
const PORT = 8747;

// Initialize the Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// CORS settings to allow frontend requests from a different origin
// `credentials: true` allows cookies to be sent and received
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    credentials: true, // Allow cookies to be included in requests
  })
);

// "Database": This is a simple in-memory storage for users
let users = [];

/**
 * POST /api/auth/signup
 * Handles user signup:
 * 1. Validates input (email and password must be provided).
 * 2. Checks if the email is already registered.
 * 3. Hashes the password using bcrypt before storing.
 * 4. Creates a JWT and sends it as a cookie.
 */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if a user with this email already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password using bcrypt before storing it
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user object with hashed password
    const newUser = {
      id: users.length + 1, // Generate a simple unique ID
      email,
      password: hashedPassword, // Store only the hashed password (not plaintext)
    };
    users.push(newUser); // Add the user to the "database"

    // Generate a JWT token for authentication
    const token = jwt.sign({ email, userId: newUser.id }, SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Set the JWT as an HTTP-only cookie
    res.cookie("jwt", token, {
      secure: true, // Ensures the cookie is only sent over HTTPS (important in production)
      sameSite: "None", // Allows cross-origin cookies when using credentials
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    });

    return res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * Middleware: verifyToken
 * Extracts JWT from the "jwt" cookie and verifies it.
 * - If missing, returns 401 (Unauthorized).
 * - If invalid or expired, returns 403 (Forbidden).
 * - If valid, extracts `userId` from the payload and attaches it to `req.userId`.
 */
function verifyToken(req, res, next) {
  const token = req.cookies.jwt; // Retrieve the JWT from cookies
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  // Verify the token using the secret key
  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.userId = payload.userId; // Attach the extracted userId to the request
    next(); // Proceed to the next middleware/route handler
  });
}

/**
 * GET /api/auth/userinfo
 * Protected route: Only accessible to authenticated users with a valid JWT.
 * - Extracts `userId` from the token (handled by `verifyToken`).
 * - Looks up the user in the database.
 * - Returns user data (excluding hashed password).
 */
app.get("/api/auth/userinfo", verifyToken, (req, res) => {
  // Find the user based on the extracted `userId`
  const currentUser = users.find((u) => u.id === req.userId);
  if (!currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Return public user information (excluding password)
  res.json({
    id: currentUser.id,
    email: currentUser.email,
    password: currentUser.password, // Normally, passwords should NEVER be sent in responses
  });
});

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
