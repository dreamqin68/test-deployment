# Minimal Backend with MongoDB

This is a minimal backend project built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), and [CORS](https://www.npmjs.com/package/cors). It is designed to handle user authentication requests from a remote [frontend](https://dreamqin68.github.io/frontend-project/). The backend includes a **user signup API** that stores user data in **MongoDB**.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Available Endpoints](#available-endpoints)
  - [POST `/api/auth/signup`](#post-apiauthsignup)

---

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (Locally installed or use **MongoDB Atlas** for cloud hosting)

---

## Project Structure

```bash
backend-mongodb/
│
├── .env                # Environment variables
├── index.js            # Main server file (Express.js setup, MongoDB connection, API routes)
├── package-lock.json   # Auto-generated file that locks dependency versions
├── package.json        # Project metadata, scripts, and dependencies
└── README.md           # Project documentation (this file)
```

## Installation

1. **Clone** the repository or download the source code.
2. **Navigate** to the project directory in your terminal.
3. **Install** dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the server:

   ```bash
   npm run dev
   ```

   or simply:

   ```bash
   node index.js
   ```

2. The server will run at http://localhost:8747.

## Features

- **Express** for creating the backend server.
- **MongoDB & Mongoose** for database connection
- **CORS** for handling cross-origin requests.
- A `/api/auth/signup` endpoint to handle user signups.
- **dotenv** support for configuration

## Environment Variables

This projectincludes a `.env` file, which contains the necessary environment variables:
