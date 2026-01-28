# Minimal Backend with MongoDB

This is a minimal backend project built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), and [CORS](https://www.npmjs.com/package/cors). It is designed to handle user authentication requests from a [frontend](https://github.com/dreamqin68/frontend-project). The backend includes a **user signup API** that stores user data in **MongoDB**.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Using Mongoose](#using-mongoose)
- [Available Endpoints](#available-endpoints)
  - [POST `/api/auth/signup`](#post-apiauthsignup)

---

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (Locally installed (**MongoDB Community Edition**) or use **MongoDB Atlas** for cloud hosting)

---

## Project Structure

```bash
backend-mongodb/
│
├── .env                # Environment variables
├── index.js            # Main server file
├── package-lock.json   # Auto-generated file that locks dependency versions
├── package.json        # Project metadata, scripts, and dependencies
└── README.md           # Project documentation (this file)
```

## Backend Setup

1. **Clone** the repository or download the source code.
2. **Navigate** to the project directory in your terminal.
3. **Install** dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

   or simply:

   ```bash
   node index.js
   ```

5. The server will run at http://localhost:8747.

## Frontend Setup

1. Download the repo: Go to https://github.com/dreamqin68/frontend-project and clone or download the repository

2. Navigate to the downloaded folder

   ```bash
   cd frontend-project
   ```

3. Start the Frontend: Run the following command to start a local static server:

   ```bash
   npm start
   ```

   or

   ```bash
   npx serve -s . -l 3000
   ```

4. Open your browser and navigate to http://localhost:3000

## Features

- **Express** for creating the backend server.
- **MongoDB & Mongoose** for database connection
- **CORS** for handling cross-origin requests.
- A `/api/auth/signup` endpoint to handle user signups.
- **dotenv** support for configuration

## Environment Variables

This project includes a `.env` file, which contains the necessary environment variables:

| Variable       | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `ORIGIN`       | Allowed frontend domain (e.g., http://localhost:3000)       |
| `DATABASE_URL` | MongoDB connection string (replace with actual credentials) |
| `PORT`         | The port number on which the server runs (8747)             |

## Using Mongoose

This project uses **Mongoose** to interact with MongoDB.

### Defining a Mongoose Schema

A Schema in Mongoose defines the structure of a document inside a MongoDB collection.

```bash
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
```

### Creating a Model

A Model in Mongoose represents a collection in MongoDB and provides methods to interact with the database.

```bash
const User = mongoose.model("User", userSchema);
```

The `User` model allows us to create, read, update, and delete (CRUD) users from the users collection in MongoDB.

### Using the Model in API Requests

The `User` model is used in the signup API to:

- **Check if a user exists** before registering.
- **Create and save a new user** in MongoDB.

```bash
// Check if the user already exists in the database
const existingUser = await User.findOne({ email });
if (existingUser) {
   return res.status(400).json({ message: "Email already registered" });
}

// Create a new user document
const newUser = new User({ email, password });
const savedUser = await newUser.save(); // Save the user to MongoDB
```

### Connecting to MongoDB

Mongoose connects to MongoDB using the `.connect()` method:

```bash
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
```

## Available Endpoints

### POST `/api/auth/signup`

Use this endpoint to send signup data to the server.

#### Request Body

```bash
{
  "email": "test@example.com",
  "password": "securepassword"
}
```

#### Response

| Status                      | Response                                        |
| --------------------------- | ----------------------------------------------- |
| `201 Created`               | `{ "message": "User registered successfully" }` |
| `400 Bad Request`           | `{ "message": "Email already registered" }`     |
| `500 Internal Server Error` | `{ "message": "Internal Server Error" }`        |

#### Example

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"mypassword"}' \
http://localhost:8747/api/auth/signup
```
