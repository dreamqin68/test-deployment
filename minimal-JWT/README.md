# Minimal JWT Authentication Example

This project provides a simple full-stack example demonstrating **JWT-based authentication**.

## Table of Contents

- [Overview](#Overview)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)

## Overview

This project implements a simple JSON Web Token (JWT)-based authentication:

**Backend:**

1. **User Signup** (`/api/auth/signup`)

   - Hashes passwords using `bcrypt`
   - Creates and stores **JWT tokens** in HTTP-only cookies
   - Prevents duplicate email registration

2. **User Authentication** (`/api/auth/userinfo`)

   - Validates JWT from cookies using `jsonwebtoken`
   - Returns user data

**Frontend**

- Uses `Axios` for API requests
- JWT tokens are handled automatically by Axios.

## Installation

Clone the repository and install dependencies:

```bash
cd minimal-JWT

# Install server dependencies
cd server
npm install

# Install client dependencies
cd client
npm install
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

3. **Open** browser and navigate to:`http://localhost:5173`.

## How It Works

1. **User Signup** (`POST /api/auth/signup`)

   - The user provides email and password.
   - The server:
     - **Validates input** (checks required fields).
     - **Hashes the password** using `bcrypt`.
     - **Generates a JWT token** containing user information(`jsonwebtoken`).
     - Stores JWT securely in **HTTP-only cookie**.
     - Responds with a success message.

2. **User Authentication** (`GET /api/auth/userinfo`)

   - When the client requests protected resources (`/api/auth/userinfo`), the JWT stored in cookies is automatically sent with requests due to `{withCredentials: true}` in `axios.create(...)`.

   - The server:
     - **Extracts the JWT** from `req.cookies.jwt`.
     - **Verifies the token** using `jsonwebtoken`.
     - **Fetches user data** and returns it.
