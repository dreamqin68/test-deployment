# Testing Guide

This document describes how to run and maintain tests for the **Auth** signup endpoint (`POST /api/auth/signup` in `app.js`). The project includes both **unit tests** (`app.unit.test.js`) and **feature tests** (`auth.test.js`). The same principles apply to testing other parts of your server.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [Test Structure](#test-structure)
- [Unit vs Feature Testing](#unit-vs-feature-testing)
- [Test coverage (app.js)](#test-coverage-appjs)
- [How It Works](#how-it-works)

## Overview

The server uses:

- **[Jest](https://jestjs.io/docs/getting-started)** as the test runner,
- **Supertest** to simulate HTTP requests against the Express app,
- **[@shelf/jest-mongodb](https://github.com/shelfio/jest-mongodb)** to provide an in-memory MongoDB for feature tests.

Unit tests mock mongoose/User so no database is used; feature tests use the ephemeral MongoDB so the full signup flow (validation, DB, response) is exercised.

## Installation

1. **Clone or Access the Project**

   Ensure you’re in the `server/` directory.

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This installs everything needed, including Jest, Supertest, and @shelf/jest-mongodb.

3. **(Optional) Manual Install**

   If you’re setting up a similar test environment from scratch:

   ```bash
   npm install --save-dev \
       jest \
       @shelf/jest-mongodb \
       supertest \
       babel-jest \
       @babel/preset-env \
       @babel/core
   ```

   What these tools do:
   - **Supertest**: Sends HTTP requests to your Express routes and checks responses.
   - **@shelf/jest-mongodb**: Starts a temporary in-memory database for feature tests.
   - **Babel**: Transforms ESM/modern JavaScript so Jest can run it.

## Project Setup

Key files involved in testing:

- **package.json**  
  Contains the `test` script (`"test": "jest"`). Run `npm test` from `server/`.

- **jest.config.cjs**  
  Uses the **@shelf/jest-mongodb** preset (sets `process.env.MONGO_URL`) and **babel-jest** for ES modules.

- **babel.config.cjs**  
  Provides Babel presets so ESM and modern JS are transformed correctly in tests.

## Usage

From the `server/` directory:

```bash
npm test
```

Jest will:

1. Start an ephemeral MongoDB when running feature tests (via the preset).
2. Run all `*.test.js` files in `__tests__/`.
3. Output pass/fail and a summary.

## Test Structure

Both test files target the signup logic in **app.js** (`signup` handler and `connectDB`).

- **Unit tests** (`app.unit.test.js`) mock mongoose and User. They call the `signup` handler and `connectDB` directly and assert on `res.status`/`res.json` and mock usage. No real DB.

- **Feature tests** (`auth.test.js`) use Supertest to send `POST /api/auth/signup` and connect to the in-memory MongoDB. They assert on HTTP status, body, and database state (e.g. user created).

Shared setup in feature tests: `beforeAll` connects to `process.env.MONGO_URL`, `afterEach` clears users and restores mocks, `afterAll` disconnects Mongoose.

## Unit vs Feature Testing

The signup endpoint is covered by two test files with different purposes:

### Unit tests: `__tests__/app.unit.test.js`

Unit tests focus on **one behavior or branch at a time** with **mocked mongoose/User**. No real database; the signup handler and connectDB are exercised in isolation.

- **What they cover:** Validation (missing email/password → 400), existing user (→ 409), success (create user → 201), catch block (save throws → 500), and `connectDB(uri)` calling `mongoose.connect(uri)`.
- **Why use them:** Fast, no DB; failures point to a specific branch or line in `app.js`.

### Feature tests: `__tests__/auth.test.js`

Feature tests (integration) hit the **real route** with Supertest and use the **in-memory MongoDB**. They test the full request → handler → DB → response flow.

- **What they cover:** Valid signup (201 + user in DB), duplicate email (409), missing email or password (400), and exception during signup (500 via mocked `User.prototype.save`).
- **Why use them:** Confidence that the API and database work together as a client would see them.

### How they differ

| Aspect | Unit (`app.unit.test.js`) | Feature (`auth.test.js`) |
|--------|----------------------------|---------------------------|
| **Scope** | One branch or function per test (e.g. validation, existingUser, connectDB) | Full HTTP request and DB per test |
| **DB** | Mocked (no MongoDB) | In-memory MongoDB |
| **Failure** | Points to a specific line/branch in `app.js` | Indicates the flow is broken somewhere |
| **Count** | More, smaller tests | Fewer, broader tests |

Use **unit tests** to lock down handler and connectDB behavior; use **feature tests** to lock down that the signup endpoint works end-to-end with a real DB.

## Test coverage (app.js)

The tables below list every test in each file and the corresponding code in `server/app.js`.

### Unit tests (`app.unit.test.js`)

| Test | Corresponding code in app.js |
|------|-------------------------------|
| returns 400 and 'Email and password are required' when email is missing | L36–40: validation branch when email or password missing → 400 |
| returns 400 and 'Email and password are required' when password is missing | L36–40: same validation branch |
| returns 409 and 'Email already registered' when user already exists | L43–46: `existingUser` branch → 409 |
| returns 201 and 'User registered successfully' when valid and user does not exist | L49–52: create user, save, return 201 |
| returns 500 and 'Internal Server Error' when save throws | L53–56: catch block → 500 |
| calls mongoose.connect with the given uri | L69–71: `connectDB(uri)` → `mongoose.connect(uri)` |

### Feature tests (`auth.test.js`)

| Test | Corresponding code in app.js |
|------|-------------------------------|
| should create a user and return 201 if email/password are valid | L49–52: success path; also checks user in DB |
| should return 409 if email is already registered | L43–46: existingUser branch |
| should return 400 if email or password is missing | L36–40: validation branch |
| should return 500 and 'Internal Server Error' if an exception occurs during signup | L53–56: catch block (triggered by mocking `User.prototype.save`) |

## How It Works

1. **Unit tests**
   - `jest.mock("mongoose", ...)` replaces mongoose with a mock. `User` in app.js becomes a mock with `findOne` and instances with `save`. Tests call `signup(req, res)` or `connectDB(uri)` and assert on `res.status`/`res.json` and mock calls.

2. **Feature tests**
   - **@shelf/jest-mongodb** sets `process.env.MONGO_URL` to an ephemeral MongoDB. `beforeAll` calls `connectDB(process.env.MONGO_URL)`.
   - **Supertest** sends `request(app).post("/api/auth/signup").send({ ... })` so the real route and handler run against the in-memory DB.
   - **Cleanup:** `afterEach` runs `User.deleteMany({})` and `jest.restoreAllMocks()`; `afterAll` disconnects Mongoose.

3. **Assertions**
   - Unit tests: `expect(res.status).toHaveBeenCalledWith(...)`, `expect(res.json).toHaveBeenCalledWith(...)`, and expectations on the User mock.
   - Feature tests: `expect(res.status).toBe(...)`, `expect(res.body.message).toBe(...)`, and queries like `User.findOne(...)` to verify DB state.
