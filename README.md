# Test Deployment

A collection of minimal projects for testing frontend, backend, and full-stack setups. Each folder is a self-contained demo you can run and extend for deployments, remote endpoints, databases, and tests.

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Subfolder Descriptions](#subfolder-descriptions)
  - [minimal-frontend](#minimal-frontend)
  - [minimal-backend](#minimal-backend)
  - [backend-mongoDB](#backend-mongodb)
  - [full-stack](#full-stack)
  - [minimal-socket](#minimal-socket)
  - [minimal-JWT](#minimal-jwt)
  - [full-stack-test](#full-stack-test)
  - [full-stack-test-coverage](#full-stack-test-coverage)
  - [full-stack-github-actions](#full-stack-github-actions)
- [Testing: full-stack-test & full-stack-test-coverage](#testing-full-stack-test--full-stack-test-coverage)
- [Getting Started](#getting-started)

## Overview

This repository contains several projects, each focused on a specific scenario:

| Folder | Focus |
|--------|--------|
| **minimal-frontend** | Minimal React/Vite frontend calling a remote backend |
| **minimal-backend** | Minimal Express server with CORS for remote frontends |
| **backend-mongoDB** | Express + MongoDB for auth and data |
| **full-stack** | MERN app: React client + Express server + MongoDB signup |
| **minimal-socket** | Real-time chat with Socket.io (client + server) |
| **minimal-JWT** | JWT auth: signup, cookies, protected userinfo |
| **full-stack-test** | Same as full-stack plus **unit and feature tests** (no coverage report) |
| **full-stack-test-coverage** | Same as full-stack-test with **coverage** enabled (`jest --coverage`) |
| **full-stack-github-actions** | CI/CD + IaC + Insights demo: GitHub Actions (CI, CD, Coverage), Docker (IaC), and analytics |

You can run any project on its own. For details and scripts, see each folder’s README.

## Folder Structure

```
test-deployment/
├── minimal-frontend      # React/Vite frontend, calls remote API
├── minimal-backend      # Express server, CORS, basic endpoints
├── backend-mongoDB      # Express + MongoDB
├── full-stack           # MERN: client + server + MongoDB signup
├── minimal-socket       # Socket.io chat (client + server)
├── minimal-JWT          # JWT auth with cookies (client + server)
├── full-stack-test           # full-stack + unit & feature tests
├── full-stack-test-coverage  # full-stack-test + coverage reports
└── full-stack-github-actions # CI/CD, IaC, GitHub Insights demo
```

## Subfolder Descriptions

### minimal-frontend

- **Purpose**: Lightweight frontend for calling a remote backend.
- **Tech**: Vite, React, Axios.
- **Usage**: `npm install` → `npm run dev`. Configure the backend URL and open the app in the browser.

### minimal-backend

- **Purpose**: Minimal Express server for handling requests from a remote frontend.
- **Tech**: Node.js, Express, CORS.
- **Usage**: `npm install` → `npm run dev`. Server listens on a port (e.g. `http://localhost:8747`).

### backend-mongoDB

- **Purpose**: Express backend with MongoDB for user auth and data.
- **Tech**: Node.js, Express, MongoDB, Mongoose, CORS.
- **Usage**: Set `DATABASE_URL`, run `npm install` and `npm run dev`.

### full-stack

- **Purpose**: Full MERN app with user signup (frontend form + backend API + MongoDB).
- **Tech**: MongoDB, Express, React, Node.js; separate `client/` and `server/`.
- **Usage**: Install in both `client/` and `server/`. Start server, then client; use the React app to test signup. See `full-stack/README.md` for env and endpoints.

### minimal-socket

- **Purpose**: Small real-time chat using Socket.io.
- **Tech**: Node.js, Express, Socket.io (server and client).
- **Usage**: Install and run both `server/` and `client/`; open the client in the browser to chat.

### minimal-JWT

- **Purpose**: Simple JWT-based auth: signup, HTTP-only cookies, and a protected userinfo endpoint.
- **Tech**: Node.js, Express, bcrypt, jsonwebtoken, Axios (client).
- **Usage**: Install and run both `client/` and `server/`; see `minimal-JWT/README.md` for endpoints and flow.

### full-stack-test

- **Purpose**: Same stack as **full-stack**, with **unit and feature tests** for the Auth signup flow (client and server). No coverage flag by default.
- **Tech**: Same as full-stack; tests use Jest, React Testing Library (client), Supertest + in-memory MongoDB (server).
- **Structure**:
  - **client/**: `auth.unit.test.jsx` (unit), `auth.test.jsx` (feature). See `client/README.md`.
  - **server/**: `auth.unit.test.js` (unit, mocked mongoose), `auth.test.js` (feature, in-memory MongoDB). See `server/README.md`.
- **Usage**: From `client/` or `server/`, run `npm test`. Each subfolder has its own Testing Guide (unit vs feature, test coverage map).

### full-stack-test-coverage

- **Purpose**: Same as **full-stack-test**, but tests run with **coverage** (`jest --coverage`). Used to reach and inspect 100% statement/branch/line coverage.
- **Tech**: Same as full-stack-test; client may add e.g. `button.unit.test.jsx` for UI component branches.
- **Usage**: From `client/` or `server/`, run `npm test` (script includes `--coverage`). Open `coverage/lcov-report/index.html` for the report. See root `full-stack-test-coverage/README.md` for metrics and unit vs feature testing.

### full-stack-github-actions

- **Purpose**: DevOps demo for **CI**, **CD**, **Infrastructure as Code (IaC)**, and **GitHub Insights & Analytics**. Same full-stack signup app as full-stack-test, with GitHub Actions workflows and Docker added.
- **Tech**: React (Vite), Express, MongoDB, Jest; GitHub Actions (`.github/workflows/ci.yml`, `cd.yml`, `coverage.yml`); Docker (Dockerfile per app, `docker-compose.yml`).
- **Highlights**:
  - **CI**: Unit and feature tests on push/PR; npm cache for fast builds; paths filter so only changes under `full-stack-github-actions/` trigger runs.
  - **CD**: Build → Deploy pipeline after CI passes; switch between Continuous Deployment (auto) and Continuous Delivery (manual approval via GitHub Environment).
  - **IaC**: Dockerfiles and docker-compose define client, server, and MongoDB; one-command run with `docker compose up --build`.
  - **Insights**: Coverage workflow posts a coverage table as a PR comment; README documents status badges and built-in GitHub Insights (Pulse, Contributors, Actions, etc.).
- **Usage**: Run tests locally from `client/` and `server/` with `npm test`. Run the full stack with Docker: from repo root, `cd full-stack-github-actions && docker compose up --build`, then open `http://localhost`. Workflows run automatically on push/PR when under `full-stack-github-actions/`. See **full-stack-github-actions/README.md** for full CI/CD, IaC, and Insights docs.

## Testing: full-stack-test & full-stack-test-coverage

Both **full-stack-test** and **full-stack-test-coverage** use the same testing approach:

- **Unit tests** (`auth.unit.test.*`): One behavior or branch at a time, with **mocked** dependencies (e.g. API client, mongoose). No real server or DB. Fast and precise.
- **Feature tests** (`auth.test.*`): Full flow (e.g. user submits form, or HTTP request → handler → DB). Use real or in-memory resources (e.g. in-memory MongoDB, mocked API). Validate integration and user-facing behavior.

| Project | Client tests | Server tests | Coverage |
|--------|---------------|--------------|----------|
| **full-stack-test** | `client/`: unit + feature | `server/`: unit + feature | Not generated by default |
| **full-stack-test-coverage** | Same + extra unit for components | Same | `npm test` writes `coverage/` and prints report |

Detailed docs:

- **full-stack-test/client/README.md** – client unit vs feature, test list, mocks.
- **full-stack-test/server/README.md** – server unit vs feature, test list, app.js coverage map.
- **full-stack-test-coverage/README.md** – how coverage is produced and how unit/feature tests contribute to it.

## Getting Started

1. **Clone** the repository:

   ```bash
   git clone https://github.com/dreamqin68/test-deployment.git
   cd test-deployment
   ```

2. **Pick a project** (e.g. `full-stack`, `full-stack-test`, `minimal-JWT`).

3. **Install and run** (paths depend on the project):
   - Single-folder projects: `cd <folder>` → `npm install` → `npm run dev` (or the script in that folder’s README).
   - Projects with `client/` and `server/`: install and run both (usually `npm run dev` in each). Check the project’s README for order and env vars.

4. **Run tests** (only in **full-stack-test** and **full-stack-test-coverage**):
   - Client: `cd full-stack-test/client` (or `full-stack-test-coverage/client`) → `npm test`.
   - Server: `cd full-stack-test/server` (or `full-stack-test-coverage/server`) → `npm test`.
   - In **full-stack-test-coverage**, `npm test` generates coverage under `coverage/` in that client or server folder.

For prerequisites (Node, npm, MongoDB where needed), see each project’s README.
