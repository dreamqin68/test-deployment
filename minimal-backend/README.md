# Minimal Backend

This is a minimal backend project built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), and [CORS](https://www.npmjs.com/package/cors). It is primarily designed to test and handle requests from a [frontend](https://github.com/dreamqin68/frontend-project). This backend includes a basic signup endpoint for demonstration purposes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
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
- **CORS** for handling cross-origin requests.
- A `/api/auth/signup` endpoint to handle user signups.

## Available Endpoints

### POST /api/auth/signup

Use this endpoint to send signup data to the server.

#### Request Body

```bash
{
  "email": "string",
  "password": "string"
}
```

#### Example

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"email":"testuser","password":"testpass"}' \
http://localhost:8747/api/auth/signup
```

Currently, this endpoint simply logs the request body to the console:

```bash
console.log("Signup request body:", req.body);
```
