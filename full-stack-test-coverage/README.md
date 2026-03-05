# Testing Coverage

This document describes how to generate and interpret **coverage reports** for both the **client** and **server**. It also explains how **unit tests** and **feature tests** work together to achieve full coverage.

## Table of Contents

- [Overview](#overview)
- [Unit vs Feature Testing](#unit-vs-feature-testing)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [Coverage Folder](#coverage-folder)
- [Client Test Coverage](#client-test-coverage)
- [Server Test Coverage](#server-test-coverage)

## Overview

This project uses [Jest](https://jestjs.io/) for both **client** and **server** tests. Run tests with the `--coverage` flag to produce coverage reports.

**Coverage metrics:**

- **Statements**: % of statements executed by tests.
- **Branches**: % of conditional paths (e.g. `if/else`, ternary) covered.
- **Functions**: % of declared functions called.
- **Lines**: % of lines executed. Uncovered lines are listed in the report.

## Unit vs Feature Testing

Coverage is achieved by combining two kinds of tests:

- **Unit tests**  
  Exercise one behavior or branch at a time with **mocked dependencies** (e.g. mocked API, mocked mongoose). No real server or DB. They target specific lines/branches in the code and give fast, precise feedback.

- **Feature tests**  
  Exercise **full flows** (e.g. user fills form and submits, or HTTP request → handler → DB). They use real or in-memory resources (e.g. in-memory MongoDB, mocked API client) and verify that the feature works end-to-end.

Together, unit tests cover branches and edge cases in isolation, and feature tests cover integration and user-facing behavior. Both contribute to the same coverage report.

## Installation

1. **Clone** the repository and go to the project directory.
2. **Install** dependencies for client and server:

   ```bash
   cd client
   npm install
   ```

   ```bash
   cd server
   npm install
   ```

## Project Setup

In both **client** and **server**, `package.json` typically has:

```json
"scripts": {
  "test": "jest --coverage"
}
```

Running `npm test` from `client/` or `server/` runs all tests and generates a coverage report.

## Usage

From `client/` or `server/`:

```bash
npm test
```

This runs Jest with coverage and writes the report under a `coverage/` folder.

- **Run a single test file** (e.g. only feature tests):

  ```bash
  npm test -- __tests__/auth.test.jsx
  ```

- **View the report**: Open `coverage/lcov-report/index.html` in a browser (or use a Live Server–style extension in the IDE). The terminal also prints a coverage summary.

## Coverage Folder

Jest writes coverage under `coverage/` in the directory where you ran the tests:

- **lcov-report/**: HTML report with line and branch details.
- **coverage-final.json** / **lcov.info**: Machine-readable data for CI or other tools.
- **clover.xml**: Alternative format for some CI systems.

To inspect coverage: open `coverage/lcov-report/index.html` and navigate to the file you care about to see which lines and branches are covered or not.

## Client Test Coverage

The client uses **unit tests** and **feature tests** for the Auth page and UI components.

- **Unit tests** (`client/__tests__/auth.unit.test.jsx`): Render the Auth page and test rendering, controlled inputs, and the signup handler in isolation (mocked `apiClient`). They cover validation, success (201), non-201 response, and catch (failed request) branches in `client/src/pages/auth/index.jsx`.
- **Feature tests** (`client/__tests__/auth.test.jsx`): Simulate the full user flow (fill form, click Signup, check message) with a mocked API. They cover success, non-201, and request-failure scenarios end-to-end.
- **Component unit tests** (e.g. `client/__tests__/button.unit.test.jsx`): Test UI components like `Button` in isolation (e.g. the `asChild` branch) so that branch coverage for shared components reaches 100%.

Together, these tests cover statements, branches, and lines in the Auth page and related components. To reach 100% branch coverage, ensure every branch (e.g. success vs non-201 vs catch, and component branches like `asChild`) is exercised by at least one unit or feature test.

## Server Test Coverage

The server uses **unit tests** and **feature tests** for the signup endpoint in `server/app.js`.

- **Unit tests** (`server/__tests__/app.unit.test.js`): Mock mongoose and the `User` model. They call the `signup` handler and `connectDB` directly and assert on `res.status`/`res.json` and mock usage. They cover: validation (400), existing user (409), success (201), catch (500), and `connectDB(uri)` calling `mongoose.connect(uri)`. No real database.
- **Feature tests** (`server/__tests__/auth.test.js`): Use Supertest to send `POST /api/auth/signup` and connect to an in-memory MongoDB. They cover: valid signup (201 + user in DB), duplicate email (409), missing email or password (400), and exception during signup (500). The 500 case is covered by mocking `User.prototype.save` to throw, which triggers the `catch` block in the signup controller.

Together, unit and feature tests cover all branches and lines in the signup flow, including the `catch` block (lines 53–56 in `app.js`).Running `npm test` from `server/` with `--coverage` should show 100% statements, branches, functions, and lines for the covered files when all tests pass.
