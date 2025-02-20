# Minimal Socket

A minimal **Socket.io** chat application where users choose a role (`me` or `friend`).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)

## Prerequisites

Ensure the following are installed on your machine before proceeding:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Project Structure

```bash
minimal-socket/
├── client
│   ├── index.html     # Single-page UI
│   ├── main.js        # Client logic (Axios + Socket.io)
│   ├── package.json
└── server
    ├── index.js       # Express + Socket.io server
    ├── package.json
```

## Installation

1. **Clone** the repository or download the source code.
2. **Navigate** to the project directory in your terminal.
3. **Install** dependencies for both the client and server:

   ```bash
   cd client
   npm install
   # This will install axios, socket.io-client, etc.
   ```

   ```bash
   cd server
   npm install
   # This will install express, cors, socket.io
   ```

## Usage

1. **Start the server**:

   ```bash
   cd server
   npm run dev
   ```

   The server will run at http://localhost:8747.

2. **Start the client**:

   ```bash
   cd client
   npm run dev
   ```

   The client will run at http://localhost:5173.

3. **Open** `http://localhost:5173` in your browser:

   - In one browser tab, choose `Me` and click `Connect`.
   - In another browser tab, choose `Friend` and click `Connect`.

4. **Send Messages**:
   - As `Me`, type a message and click `Send`. It shows up right-aligned for Me, left-aligned for Friend.
   - As `Friend`, type a message; it’s right-aligned in the Friend’s view, left-aligned in Me’s view.

## How It Works

### Server Logic

- The server runs at `http://localhost:8747`.
- **Socket.io** is attached to the same Express server.
- Each socket connection passes a query parameter `?user=me` or `?user=friend`.
- The server stores `userMap[user] = socket.id`, so it knows which socket belongs to `me` or `friend`.
- When a message is sent via client `POST /api/messages` with `sender: "me"| "friend"`, the server:
  - Finds the recipient
  - Emits `newMessage` only to those two sockets.

### Client Logic

- The user chooses `Me` or `Friend` from a dropdown, then clicks `Connect`. This creates a Socket.io connection `(io(..., { query: { user: myRole }}))`.
- When the user sends a message (via `Axios to /api/messages`), the server emits it back only to the sender and recipient's socket.
- The client code listens for `socket.on("newMessage")` and displays the message in one box.
