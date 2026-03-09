// index.js
import dotenv from "dotenv";
import { app, connectDB } from "./app.js"; // Import from app.js

dotenv.config();

const PORT = process.env.PORT || 8747;
const DATABASE_URL = process.env.DATABASE_URL;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB(DATABASE_URL);
    console.log("MongoDB connected successfully");

    // Now start the server listening
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Only call startServer if we're not in a Jest test environment
if (!process.env.JEST_WORKER_ID) {
  startServer();
}
