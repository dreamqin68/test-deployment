# Testing Coverage

This document describes how to generate and interpret **coverage reports** for both the **client** and **server** sides of the application. Coverage reports help ensure that tests effectively exercise your code, revealing any untested lines or branches.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [Coverage Folder](#coverage-folder)
- [Client Test Coverage](#client-test-coverage)
- [Server Test Coverage](#sertver-test-coverage)

## Overview

This project uses [Jest](https://jestjs.io/) for both **client** and **server** tests. Jest can produce detailed coverage reports by adding the `--coverage` flag to test commands.

**Key Points:**

- **Coverage Metrics**:
  - **Statements**: % of statements in your code that are executed by tests.
  - **Branches**: % of conditional paths (e.g., `if/else`, switch cases) covered by tests.
  - **Functions**: % of declared functions called by tests.
  - **Lines**: Similar to statements, but specifically tracks which lines in files were executed.
- **Uncovered Line**: Lines that remain untested will be highlighted in the coverage report.

## Installation

1. **Clone** the repository or download the source code.
2. **Navigate** to the project directory in your terminal.
3. **Install** dependencies for both the client and server:

   ```bash
   cd client
   npm install
   ```

   ```bash
   cd server
   npm install
   ```

## Project Setup

Both the **client** and **server** have a `package.json` containing scripts like:

```bash
"scripts": {
    "test": "jest --coverage",
    ...
}
```

When you run `npm test`, Jest automatically includes coverage in the generated reports.

## Usage

To run tests from either the `client/` or `server/` directory, execute:

```bash
npm test
```

This runs the Jest tests and produces a coverage report in a `coverage/` folder by default.

- **Run One Specific Test**:
  If you only want to run one test file (e.g., `auth.test.jsx`), do:

  ```bash
  npm test  __tests__/auth.test.jsx
  ```

- **Open Coverage Report**:

  After tests complete, open `coverage/lcov-report/index.html` in your browser to see a detailed HTML report.
  The terminal output also shows a coverage summary.

## Coverage Folder

Jest saves coverage data to a `coverage` folder in whichever directory you run the tests:

- `lcov-report/`: Contains HTML files with line-by-line and branch-by-branch details.
- `coverage-final.json` or `lcov.info`: Machine-readable coverage data for external tools.
- `clover.xml`: Another coverage format some CI systems can parse.

**To view the coverage**:

1. If using VSCode, install **Live Server** or a similar extension.
2. Right-click `coverage/lcov-report/index.html` and choose `Open with Live Server`.
3. Drill down into specific files to see which lines and branches are covered or uncovered.

## Client Test Coverage

Initially, in `auth/index.jsx`(We can see it in `full-stack-test/client/src/pages/auth/index.jsx`), only the success path (`if (response.status === 201)`) had behavior. If `response.status` was anything else (like `200` or `400`), the code did nothing (no `else` block). As a result, the `false branch` was never actually covered by any test, which caused something like:

```bash
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
index.jsx |   100   |    75    |   100   |   100   | 28
```

We added an **explicit else branch** to cover non-201 responses in `client/src/pages/auth/index.jsx`:

```bash
if (response.status === 201) {
  setMessage("Signup successful!");
} else {
  // Explicitly handle the false branch
  setMessage("Signup did not succeed");
}
```

We then introduced a new test `client/__tests__/authExtended.test.jsx`:

1. Mocking Non-201 Response: We force `apiClient.post` to resolve with `{ status: 200 }`.
2. False Branch Coverage: This triggers the `else` block `(setMessage("Signup did not succeed"))`.
3. Assertion: We check for the text `"Signup did not succeed"` to confirm that the else block ran.

**Result**:

- **Statements, Funcs and Lines**: Already 100% from the `__tests__/auth.test.jsx`.
- **Branch Coverage**: Increased to 100% by covering the new `else` path.

## Server Test Coverage

The test file, `server/__tests__/auth.test.js`tested scenarios for:

- Success (status 201)
- Duplicate email (status 400)
- Missing fields (status 400)

But the error-handling (`catch`) block in `server/app.js` never ran

```bash
catch (error) {
    // console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
```

Causing coverage reports to show something like:

```bash
File    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
app.js  |   91.66 |   100    |   100   |   91.66 | 55-56
```

To fully exercise the catch block, we add `server/__tests__/authExtended.test.js`

1. triggers the `catch` block in the signup controller.
2. The test then confirms a `500` status and the message `"Internal Server Error"`

**Result**:

- **Branch and Funcs**: Already 100% from the `__tests__/auth.test.jsx`.
- **Statements and Lines**: Increased to 100% by covering the `catch` block.
