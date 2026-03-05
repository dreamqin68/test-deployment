# Testing Guide

This document describes how to run and maintain tests for the **Auth** component (`client/src/pages/auth/index.jsx`). The project includes both **unit tests** (`auth.unit.test.jsx`) and **feature tests** (`auth.test.jsx`). The same principles apply to testing other parts of your React application.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [Mocks Overview](#mocks-overview)
- [Test Structure](#test-structure)
- [Unit vs Feature Testing](#unit-vs-feature-testing)
- [Test coverage (index.jsx)](#test-coverage-indexjsx)
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

Both test files target the **Auth** component (`client/src/pages/auth/index.jsx`).

- **Unit tests** (`auth.unit.test.jsx`) are grouped by concern: `render`, `controlled inputs`, and `handleSignup / API`. Each test has a comment linking it to the relevant lines in `index.jsx`.

- **Feature tests** (`auth.test.jsx`) are organized around user flows. Shared patterns in both files include:
  - **User interaction:** React Testing Library’s `userEvent` is used to fill email/password fields and click the `Signup` button.

  - **Success vs. failure:** Success is asserted when `apiClient.post` resolves with status `201` and the UI shows **Signup successful!**; failure is asserted when `apiClient.post` rejects and the UI shows **Signup failed. Please try again.**

## Unit vs Feature Testing

The Auth page is covered by two test files that serve different purposes:

### Unit tests: `__tests__/auth.unit.test.jsx`

Unit tests focus on **one piece of behavior at a time** in isolation. Each test targets a specific part of `index.jsx` (e.g. a single state update, one branch of `handleSignup`, or one element in the JSX).

- **What they cover:** Rendering (heading, inputs, button, initial message state), controlled inputs (email, password, confirm password), and the signup flow in detail: API call arguments (`SIGNUP_ROUTE`, body, `withCredentials`), success path (status 201 → "Signup successful!"), error path (rejected promise → "Signup failed. Please try again."), and edge cases (e.g. non-201 response, empty form submission).
- **Why use them:** Fast feedback, clear failure messages (you know exactly which behavior broke), and good coverage of branches and props without running a full user flow.

### Feature tests: `__tests__/auth.test.jsx`

Feature tests (sometimes called integration or end-to-user tests) focus on **complete user flows**. They simulate a real user: filling the form, clicking Signup, and checking the outcome.

- **What they cover:** Three scenarios: (1) successful signup (status 201 → "Signup successful!"), (2) non-201 response (e.g. 200 → "Signup did not succeed"), and (3) failed signup (rejected promise → "Signup failed. Please try again."). Each test exercises the full flow from form to `handleSignup` to message display.
- **Why use them:** Confidence that the feature works as a user would see it; they catch integration issues between the form, the handler, and the API mock.

### How they differ

| Aspect      | Unit (`auth.unit.test.jsx`)                                                                            | Feature (`auth.test.jsx`)                                    |
| ----------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **Scope**   | One behavior or code path per test (e.g. "email input is controlled", "post called with correct args") | Full user journey per test (fill form → click → see message) |
| **Failure** | Points to a specific line or branch in `index.jsx`                                                     | Indicates the flow is broken somewhere in the chain          |
| **Count**   | More, smaller tests (e.g. render, each input, each API outcome)                                        | Fewer, broader tests (success flow, failure flow)            |
| **Speed**   | Slightly more tests but still fast (all mocked)                                                        | Fewer tests, also fast                                       |

Use **unit tests** to lock down exact behavior (state, props, API calls). Use **feature tests** to lock down that the Auth page works end-to-end for a user. Together they give both precision and user-level confidence.

### Test coverage (index.jsx)

The tables below list every test in each file and the corresponding code in `client/src/pages/auth/index.jsx` (by line numbers).

**Unit tests (`auth.unit.test.jsx`)**

| Test                                                                             | Corresponding code in index.jsx                                                                                  |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| renders Welcome heading                                                          | L41–42: `<h1>` with text "Welcome"                                                                               |
| renders email, password, and confirm password inputs                             | L46–67: three `<Input>` components with placeholders "Email", "Password", "Confirm Password"                     |
| renders Signup button                                                            | L68–70: `<Button>` with text "Signup" and `onClick={handleSignup}`                                               |
| does not show message on initial render                                          | L12–13: `message` state initialised to `""`; L71–73: `{message && ...}` renders nothing when `message` is empty  |
| email input is controlled and updates on type                                    | L10: `email` state; L50–52: `value={email}` and `onChange={(e) => setEmail(e.target.value)}`                     |
| password input is controlled and updates on type                                 | L11: `password` state; L58–60: `value={password}` and `onChange` for setPassword                                 |
| confirm password input is controlled and updates on type                         | L12: `confirmPassword` state; L65–67: `value={confirmPassword}` and `onChange` for setConfirmPassword            |
| calls apiClient.post with SIGNUP_ROUTE, body and withCredentials on Signup click | L17–25: `apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true })`                           |
| sends empty email and password when inputs are empty                             | L10–11: initial state `""`; L19–22: request body uses current `email` and `password` (no client-side validation) |
| sets message to "Signup successful!" when response status is 201                 | L27–29: `if (response.status === 201) setMessage("Signup successful!")`; L71–73: message rendered in UI          |
| sets message to "Signup failed. Please try again." when post rejects             | L31–33: `catch` block `setMessage("Signup failed. Please try again.")`; L71–73: message rendered in UI           |
| does not show success message when response status is not 201                    | L27–29: success message only set when `response.status === 201`; other statuses leave `message` unchanged        |

**Feature tests (`auth.test.jsx`)**

| Test                                                                                         | Corresponding code in index.jsx                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| displays "Signup successful!" when signup returns status 201                                 | L15–29: `handleSignup` calls `apiClient.post` (L17–25), then `if (response.status === 201)` sets message (L27–29); L46–70: form inputs and Signup button; L71–73: message displayed |
| displays "Signup failed. Please try again." with status when signup returns a non-201 status | else branch: when `response.status !== 201`, message includes `(Status: ${response.status})`; L46–70: form and button; L71–73: message displayed                                    |
| displays error message when signup fails                                                     | L31–33: `catch` in `handleSignup` sets error message; L46–70: form and button; L71–73: message displayed                                                                            |

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
