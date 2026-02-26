# Testing Guide

This document describes how to run and maintain the unit test (`client/__tests__/auth.test.jsx`) for the **Auth** component, located in
`client/src/pages/auth/index.jsx`. While the example focuses on one component, the same principles apply
to testing other parts of your React application.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [Mocks Overview](#mocks-overview)
- [Test Structure](#test-structure)
- [How It Works](#how-it-works)

## Overview

The frontend uses [Jest](https://jestjs.io/docs/getting-started) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and integration testing.

Key Points:

- **Realistic DOM Simulation**: Tests run under `jsdom` so components behave much like they do in a browser.

- **Simple API for User Interactions**: With [React Testing Library’s `userEvent`](https://testing-library.com/docs/user-event/intro),
  we can simulate typing, clicking, and other browser events.

- **Easy Mocking**: `__mocks__` folder contains mocks for network requests and file imports, ensuring tests remain isolated and predictable.

## Installation

1. **Clone or Access the Project**

   Ensure you’re in the `client/` directory.

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This installs all dependencies, including Jest, React Testing Library, and any Babel or Jest plugins.

3. **(Optional) Manual Install**

   If you’re setting up a similar test environment in your own project from scratch, install the following:

   ```bash
   npm install --save-dev \
       jest \
       jest-environment-jsdom \
       babel-jest \
       @babel/preset-env \
       @babel/preset-react \
       react-test-renderer \
       @testing-library/react \
       @testing-library/user-event \
       @testing-library/jest-dom
   ```

   What these tools do:
   - Virtual Browser (JSDOM): Simulates a browser environment in Node.
   - Translators (Babel): Converts JSX and modern JS so Jest can read them.
   - The "Eyes" (Testing Library): Finds elements like buttons and inputs on the screen.
   - The "Hands" (User Event): Mimics real human typing and clicking.
   - The "Language" (Jest-DOM): Adds intuitive checks like .toBeInTheDocument().

## Project Setup

Here are the key files and folders involved in testing:

- `package.json`

  ```bash
  "scripts": {
      "test": "jest",
      ...
  }
  ```

  Contains the `test` script, which runs Jest when you execute `npm test`.

- `jest.config.cjs`

  Configures how Jest transforms code, uses module aliases (e.g., `@/lib/...`), and sets up jsdom.

- `babel.config.cjs`

  Provides Babel presets (`@babel/preset-env`, `@babel/preset-react`) so Jest can parse modern JavaScript/JSX.

- `__mocks__` Folder

  Holds manual mocks (e.g., `api-client.js`, `constants.js`, `fileMock.cjs`) that replace real modules during tests. This prevents real HTTP requests or large file imports in a test environment.

## Usage

To run test from the `client/` directory, execute:

```bash
npm test
```

Jest will:

1. Find files matching `*.test.js` or `*.test.jsx`.
2. Run tests in a Node.js environment configured to simulate a browser via `jsdom`.
3. Output pass/fail results and a summary of any failed assertions.

## Mocks Overview

The `__mocks__` folder contains three files that Jest uses whenever the actual modules are imported in your code:

- `api-client.js`
  - This file mocks the default export from `@/lib/api-client`.
  - The `post` function is set to a Jest mock, which you can configure in your tests to return success or error responses without making real network calls.
- `constants.js`
  - Mocks the constants that your code imports from `@/lib/constants`.
  - This avoids the need for `import.meta.env` or environment variables in your test environment.
  - The `HOST` and `SIGNUP_ROUTE` are replaced with safe, local values for testing.
- `fileMock.cjs`
  - Used to mock image imports (e.g. `login3.webp`).
  - Instead of trying to load the actual file, Jest will just see `test-file-stub` whenever your component imports an image.

By redirecting your code’s imports to these mocked modules, you control all dependencies during tests—particularly eliminating real API calls and large binary assets.

## Test Structure

The test targeting the **Auth** component (`client/src/pages/auth/index.jsx`). Key features in this file include:

- **User Interaction Simulation:**

  Use React Testing Library’s `userEvent` to fill in email/password fields and click the `Signup` button.

- **Success vs. Failure Scenarios:**
  - A **success** test case ensures the UI displays **Signup successful!** when `apiClient.post` resolves with a `201` status.
  - A **failure** test case verifies the UI displays **Signup failed. Please try again.** when `apiClient.post` rejects with an error.

## How It Works

1. **Mock Setup**
   - In `beforeEach`, we reset mocks (i.e., `jest.clearAllMocks()`) to ensure each test starts fresh.
   - For success tests, we do:

     ```bash
     apiClient.post.mockResolvedValue({ status: 201 });
     ```

   - For failure tests, we do:

     ```bash
     apiClient.post.mockRejectedValue(new Error("Signup failed"));
     ```

2. **Rendering the Component:**

   Use `render()` from React Testing Library to mount your component in a test DOM.

   ```bash
   render(<Auth />);
   ```

   This mounts the **Auth** component in a virtual `jsdom` environment.

3. **Typing and Clicking:**

   Using `userEvent` to simulate user interactions.
   - Using `userEvent.type` to enter email/password,
   - then `userEvent.click` on the `Signup` button triggers the component’s `handleSignup` function.

4. **Waiting for the UI Update:**

   Use `expect()` statements to verify the component’s behavior.

   ```bash
   await waitFor(() => {
        expect(screen.getByText(/signup successful!/i)).toBeInTheDocument();
   });
   ```

   or the failure message. `waitFor` waits for the DOM to update asynchronously.

5. **Asserting Behavior:**

   The test checks whether the correct success/error messages appear, confirming that the component handles the mock `apiClient.post` call correctly.
