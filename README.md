# Test Deployment

A collection of minimal projects designed to test various frontend and backend setups. Each folder demonstrates a different configuration or technology stack, allowing you to experiment with deployments, remote endpoints, and database integrations.

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Subfolder Descriptions](#subfolder-descriptions)
  - [minimal-frontend](#minimal-frontend)
  - [minimal-backend](#minimal-backend)
  - [backend-mongoDB](#backend-mongoDB)
  - [full-stack](#full-stack)
- [Getting Started](#getting-started)

## Overview

This repository contains four separate projects, each focused on testing or demonstrating a particular deployment scenario or architectural style. You can deploy them individually or use them together to test interactions between frontends, backends, and databases.

## Folder Structure

```bash
test-deployment/
├── minimal-frontend
├── minimal-backend
├── backend-mongoDB
└── full-stack
```

- **minimal-frontend** – A minimal React/Vite-based frontend used to test remote backend endpoints.
- **minimal-backend** – A Node.js/Express-based backend that can handle basic requests and demonstrate cross-origin interactions with a remote frontend.
- **backend-mongoDB** – A Node.js/Express-based backend connected to MongoDB for user authentication and data storage.
- **full-stack** – A complete MERN stack project with frontend, backend, and MongoDB integration for user signup.

## Subfolder Descriptions

### minimal-frontend

- **Purpose**: A simple frontend project used for testing remote backend endpoints.
- **Tech Stack**: Vite(React), plain JavaScript, and Axios.
- **Key Features**:
  - Minimal `index.html` and `main.js` files.
  - Makes a signup request to a remote backend endpoint via Axios.
- **Usage**:
  - Install dependencies with `npm install`.
  - Run `npm run dev` (or similar script).
  - Open `http://localhost:<PORT>` to see the minimal frontend.

### minimal-backend

- **Purpose**: A minimal Node.js/Express server designed to test and handle requests from a remote frontend.
- **Tech Stack**: Node.js, Express, CORS.
- **Key Features**:
  - Basic signup endpoint for demonstration.
  - Configured with CORS to accept cross-origin requests.
- **Usage**:

  - Install dependencies with `npm install`.
  - Run `npm run dev` (or similar script).
  - The server listens on a specified port (e.g., `http://localhost:8747`).

### backend-mongoDB

- **Purpose**: A Node.js/Express backend that connects to a MongoDB database for user authentication.
- **Tech Stack**: Node.js, Express, MongoDB, Mongoose, CORS.
- **Key Features**:
  - **User Signup API** that stores user data in a MongoDB collection.
  - Demonstrates how to handle cross-origin requests from a remote frontend.
- **Usage**:
  - Ensure MongoDB is running locally or set your `DATABASE_URL` to a hosted instance.
  - Install dependencies with `npm install`.
  - Run `npm run dev` (or similar script).

### full-stack

- **Purpose**: A complete MERN stack project featuring a frontend and backend together.
- **Tech Stack**: MongoDB, Express, React, Node.js.
- **Key Features**:
  - **User Signup** on both the frontend and backend.
  - Database integration for storing user credentials.
  - Separate client and server directories.
- **Usage**:
  - Install dependencies in both the `client` and `server` folders.
  - Run the backend (`npm run dev` in the `server` folder).
  - Run the frontend (`npm run dev` in the `client` folder).
  - Access the React app in the browser to test signup functionality.

## Getting Started

1. **Clone** this repository

   ```bash
   git clone https://github.com/dreamqin68/test-deployment.git
   ```

2. **Navigate** to the subfolder you want to test or deploy.
3. **Install dependencies** for that project.
4. **Run** the project using the scripts provided (e.g., `npm run dev`).
