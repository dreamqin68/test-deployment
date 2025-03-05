# Testing Guide

This document explains how to run and maintain the **Auth** endpoint test.
The test, located at `server/__tests__/auth.test.js`, checks the **signup** flow at
`POST /api/auth/signup` using an **ephemeral in-memory MongoDB** instance.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [Test Structure](#test-structure)
- [How It Works](#how-it-works)

## Overview

In this project, we use:

- **[Jest](https://jestjs.io/docs/getting-started)** as the test runner,
- **Supertest** to simulate HTTP requests against our Express server,
- **@shelf/jest-mongodb** to spin up an in-memory MongoDB, avoiding real database interactions.

The test ensures that:

1. `POST /api/auth/signup` creates a new user with valid credentials.
2. It returns appropriate errors for duplicate emails or missing fields.

When you run tests, **@shelf/jest-mongodb** automatically sets up an ephemeral MongoDB instance so you can test database logic quickly and in isolation.

## Installation

1. **Clone or Access the Project**

   Ensure you’re in the `server/` directory.

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This installs everything needed, including Jest, Supertest, and @shelf/jest-mongodb.

3. **(Optional) Manual Install**

   If you’re setting up a similar test environment in your own project from scratch, install the following:

   ```bash
   npm install --save-dev \
       jest \
       @shelf/jest-mongodb \
       supertest \
       babel-jest \
       @babel/preset-env \
       @babel/core \
   ```

## Project Setup

Here are the key files involved in testing:

- `package.json`

  ```bash
  "scripts": {
      "test": "jest",
      ...
  }
  ```

  Contains the `test` script, which runs Jest when you execute `npm test`.

- `jest.config.cjs`

  - Tells Jest to use the **@shelf/jest-mongodb** preset for in-memory DB.
  - Uses `babel-jest` for ES module transformations (if needed).

- `babel.config.cjs`

  Provides Babel presets (`@babel/preset-env`) to Ensures ESM code or modern JavaScript is transformed properly in tests.

## Usage

To run test from the `server/` directory, execute:

```bash
npm test
```

Jest will:

1. Start an ephemeral MongoDB (via `@shelf/jest-mongodb`),
2. Execute test files (like `auth.test.js`),
3. Output pass/fail results and a summary of any failed assertions,
4. Tear down the in-memory database when done.

## Test Structure

The primary test is `auth.test.js` in `__tests__`. It uses:

- `beforeAll` to connect Mongoose to `process.env.MONGO_URL` (set by` @shelf/jest-mongodb`),
- `Supertest` calls `POST /api/auth/signup` with different payloads (valid, duplicate email, missing fields),
- `Expect` statements verify status codes and JSON responses.
- **Success Scenarios**

  - **Valid Credentials**: When the request body has a valid email and password,
    the endpoint should:
    1. Create a user in the (in-memory) database.
    2. Respond with a `201` status code.
    3. Return a JSON message: `"User registered successfully"`.
  - The test verifies these conditions by checking the HTTP response and then confirming
    the new user’s existence in the database via a Mongoose query.

- **Failure Scenarios**

  1. **Duplicate Email**:

     - If the provided email is already registered, the endpoint should:
       - Respond with a `400` status code.
       - Return a message: `"Email already registered"`.
     - The test creates a user first, then attempts to create another user
       with the same email and expects `400`.

  2. **Missing Fields**:
     - If the request is missing either `email` or `password`, the endpoint should:
       - Respond with a `400` status code.
       - Return an error message indicating the required fields are missing.
     - The test sends one request missing `password`, and another missing `email`,
       verifying each fails with `400`.

## How It Works

1. **In-Memory MongoDB**

   - `@shelf/jest-mongodb` sets up process.env.MONGO_URL to point to an ephemeral database.
   - No real or local database is used, so tests won’t pollute real data.

2. **Connecting**

   - `beforeAll` calls `connectDB(process.env.MONGO_URL)` to use the ephemeral DB.

3. **Requesting**

   - With `Supertest` (`request(app)`), call Express routes in memory. No actual port needed.

4. **Cleanup**

   - `afterEach` cleans up any created User documents, ensuring each test is independent.
   - `afterAll` disconnects from Mongoose to free resources.

5. **Asserting Behavior:**

   - Check whether status codes, messages, and database entries match expectations (e.g., user creation, error responses).
