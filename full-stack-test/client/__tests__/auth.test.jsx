/**
 * We import `apiClient` from our custom library, which is then mocked.
 * We also import testing utilities from React Testing Library:
 *  - `render` to mount components in a simulated DOM,
 *  - `screen` to query the DOM,
 *  - `waitFor` to handle asynchronous state updates.
 * We use `@testing-library/jest-dom` for specialized matchers like `.toBeInTheDocument()`.
 */
import apiClient from "@/lib/api-client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Auth from "../src/pages/auth/index";

/**
 * We group our tests under a `describe` block titled "Auth Page".
 * This helps organize and label tests in Jest's output.
 */
describe("Auth Page", () => {
  /**
   * We'll override `console.log` to keep our test output clean
   * (e.g., to prevent printing "Error: Signup failed" in our console).
   */
  let originalLog;

  /**
   * `beforeAll` runs once before any tests in this `describe` block.
   * Here, we save the original `console.log` and replace it with a Jest mock.
   */
  beforeAll(() => {
    originalLog = console.log;
    console.log = jest.fn(); // No-op for logs
  });

  /**
   * `afterAll` runs once after all tests finish.
   * We restore `console.log` so we don't affect other test files.
   */
  afterAll(() => {
    console.log = originalLog;
  });

  /**
   * `beforeEach` runs before every single test in this `describe` block.
   * We use it to clear all mocks, ensuring each test starts with a clean slate.
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 1st test: If the API call resolves with a 201 status,
   * we expect the UI to display "Signup successful!".
   */
  test('displays "Signup successful!" when signup returns status 201', async () => {
    /**
     * Mocking the `apiClient.post` method to resolve with `{ status: 201 }`.
     * This simulates a successful signup response.
     */
    apiClient.post.mockResolvedValue({ status: 201 });

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    /**
     * We grab the input fields and signup button from the DOM
     * using placeholders/labels. React Testing Library offers
     * various query methods, such as getByPlaceholderText, getByRole, etc.
     */
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);
    const signupButton = screen.getByRole("button", { name: /signup/i });

    /**
     * `userEvent.type` simulates typing into the input fields.
     * We enter a valid email and matching passwords to mimic user input.
     */
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    /**
     * Simulate a button click to trigger the Auth component's
     * handleSignup function, which calls `apiClient.post`.
     */
    userEvent.click(signupButton);

    /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "Signup successful!" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/signup successful!/i)).toBeInTheDocument();
    });
  });

  /**
   * 2nd test: If the API call rejects, we expect the UI to display
   * "Signup failed. Please try again." as an error message.
   */
  test("displays error message when signup fails", async () => {
    /**
     * Mocking the `apiClient.post` method to reject with an Error object.
     * This simulates a failed signup response from the server.
     */
    apiClient.post.mockRejectedValue(new Error("Signup failed"));

    /**
     * Again, we mount the Auth component so we can interact with it in the test.
     */
    render(<Auth />);

    /**
     * We retrieve the email/password/confirmPassword fields and signup button
     * just like in the previous test.
     */
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);
    const signupButton = screen.getByRole("button", { name: /signup/i });

    /**
     * Simulate user typing in valid credentials, then clicking signup.
     * Because `apiClient.post` is mocked to reject, this will produce an error scenario.
     */
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    userEvent.click(signupButton);

    /**
     * We wait for the error message "Signup failed. Please try again."
     * to appear, confirming the Auth component handles failures correctly.
     */
    await waitFor(() => {
      expect(
        screen.getByText(/signup failed\. please try again\./i)
      ).toBeInTheDocument();
    });
  });
});
