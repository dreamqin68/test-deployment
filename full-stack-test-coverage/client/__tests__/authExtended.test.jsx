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
   * Clear mocks before each test to ensure a clean slate.
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test 3: Non-201 Response Scenario
   * If the API call resolves with a status other than 201 (e.g., 200),
   * the success branch should not be executed.
   * In this case, no success message should be set.
   */
  test('displays "Signup did not succeed" when signup returns a non-201 status', async () => {
    // Simulate a response with a status other than 201 (e.g., 200)
    apiClient.post.mockResolvedValue({ status: 200 });

    render(<Auth />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);
    const signupButton = screen.getByRole("button", { name: /signup/i });

    await userEvent.type(emailInput, "another@example.com");
    await userEvent.type(passwordInput, "pass123");
    await userEvent.type(confirmPasswordInput, "pass123");

    userEvent.click(signupButton);

    // Wait for the message to update to the false branch message.
    await waitFor(() => {
      expect(screen.getByText(/signup did not succeed/i)).toBeInTheDocument();
    });
  });
});
