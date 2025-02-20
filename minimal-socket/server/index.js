import express from "express";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for messages
let messages = [];

// Map user => socket.id (e.g., { me: <socketId>, friend: <socketId> })
const userMap = {};

/**
 * Body: { sender: "me"|"friend", text: "..."}
 * The server figures out the recipient and emits only to those two socket IDs.
 * This ensures only "me" and "friend" see the messages.
 */
function chatHandler(req, res) {
  const { sender, text } = req.body;
  if (!sender || !text) {
    console.log("Missing sender or text.");
    return res.status(400).json({ error: "Missing sender or text" });
  }

  // Create a new message object
  const newMessage = { sender, text, time: Date.now() };
  messages.push(newMessage);

  console.log(`New message from "${sender}": "${text}"`);

  // Determine the recipient
  const recipient = sender === "me" ? "friend" : "me";

  // Emit only to the sender and the recipient
  const senderSocketId = userMap[sender];
  const recipientSocketId = userMap[recipient];

  if (senderSocketId) {
    io.to(senderSocketId).emit("newMessage", newMessage);
  }
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("newMessage", newMessage);
  }

  console.log(
    `Emitted "newMessage" to "${sender}" (socket=${senderSocketId}) and ` +
      `"${recipient}" (socket=${recipientSocketId}).`
  );

  return res.status(201).json({ success: true, message: newMessage });
}

// POST /api/messages
app.post("/api/messages", chatHandler);

// Start the server
const PORT = 8747;
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Attach Socket.io to this server
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  // The client sends a query param like: /socket.io/?user=me
  const user = socket.handshake.query.user;
  console.log(`Client connected: socketId=${socket.id}, user="${user}"`);

  // Store the mapping (e.g., userMap["me"] = <socketId>)
  userMap[user] = socket.id;

  socket.on("disconnect", () => {
    console.log(`Client disconnected: socketId=${socket.id}, user="${user}"`);
    // Remove user from the map
    delete userMap[user];
  });
});
