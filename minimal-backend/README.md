# Minimal Backend

This is a minimal backend project built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), and [CORS](https://www.npmjs.com/package/cors). It is primarily designed to test and handle requests from a remote [frontend](https://dreamqin68.github.io/frontend-project/). This backend includes a basic signup endpoint for demonstration purposes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Available Endpoints](#available-endpoints)
  - [POST `/api/auth/signup`](#post-apiauthsignup)

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Project Structure

```bash
minimal-backend/
│
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

- **index.js**: Main server file (Express.js setup, CORS configuration, routes).
- **package-lock.json**: Auto-generated file that locks dependency versions.
- **package.json**: Project metadata, scripts, and dependencies.
- **README.md**: Project documentation (this file).

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

2. By default, the server will run at http://localhost:8747.

## Features

- **Express** for creating the backend server.
- **CORS** for handling cross-origin requests.
- A `/api/auth/signup` endpoint to handle user signups.

## Available Endpoints

### POST /api/auth/signup

Use this endpoint to send signup data to the server.

#### Request Body

```bash
{
  "username": "string",
  "password": "string"
}
```

#### Example

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"username":"testuser","password":"testpass"}' \
http://localhost:8747/api/auth/signup
```

Currently, this endpoint simply logs the request body to the console:

```bash
console.log("Signup request body:", req.body);
```
