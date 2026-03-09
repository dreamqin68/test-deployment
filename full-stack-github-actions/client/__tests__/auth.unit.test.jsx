/**
 * Unit tests for Auth page (src/pages/auth/index.jsx).
 * Tests rendering, controlled inputs, and handleSignup/API integration in isolation.
 */
import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE } from "@/lib/constants";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Auth from "../src/pages/auth/index";

describe("Auth (unit)", () => {
  let originalLog;

  beforeAll(() => {
    originalLog = console.log;
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = originalLog;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render", () => {
    /** Corresponds to index.jsx lines 41–42: the <h1> with text "Welcome". */
    test("renders Welcome heading", () => {
      render(<Auth />);
      expect(
        screen.getByRole("heading", { name: /welcome/i }),
      ).toBeInTheDocument();
    });

    /** Corresponds to index.jsx lines 46–67: the three <Input> components with placeholders "Email", "Password", "Confirm Password". */
    test("renders email, password, and confirm password inputs", () => {
      render(<Auth />);
      expect(screen.getByPlaceholderText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/confirm password/i),
      ).toBeInTheDocument();
    });

    /** Corresponds to index.jsx lines 68–70: the <Button> with text "Signup" and onClick={handleSignup}. */
    test("renders Signup button", () => {
      render(<Auth />);
      expect(
        screen.getByRole("button", { name: /signup/i }),
      ).toBeInTheDocument();
    });

    /** Corresponds to index.jsx lines 12–13 (message state "") and 71–73: {message && ...} renders nothing when message is empty. */
    test("does not show message on initial render", () => {
      render(<Auth />);
      expect(screen.queryByText(/signup successful!/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/signup failed/i)).not.toBeInTheDocument();
    });
  });

  describe("controlled inputs", () => {
    /** Corresponds to index.jsx lines 10, 50–52: email state and Input value={email} onChange={(e) => setEmail(e.target.value)}. */
    test("email input is controlled and updates on type", async () => {
      const user = userEvent.setup();
      render(<Auth />);
      const input = screen.getByPlaceholderText(/^email$/i);
      await user.type(input, "a@b.co");
      expect(input).toHaveValue("a@b.co");
    });

    /** Corresponds to index.jsx lines 11, 58–60: password state and Input value={password} onChange setPassword. */
    test("password input is controlled and updates on type", async () => {
      const user = userEvent.setup();
      render(<Auth />);
      const input = screen.getByPlaceholderText(/^password$/i);
      await user.type(input, "secret");
      expect(input).toHaveValue("secret");
    });

    /** Corresponds to index.jsx lines 12, 65–67: confirmPassword state and Input value={confirmPassword} onChange setConfirmPassword. */
    test("confirm password input is controlled and updates on type", async () => {
      const user = userEvent.setup();
      render(<Auth />);
      const input = screen.getByPlaceholderText(/confirm password/i);
      await user.type(input, "secret");
      expect(input).toHaveValue("secret");
    });
  });

  describe("handleSignup / API", () => {
    /** Corresponds to index.jsx lines 17–25: apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true }). */
    test("calls apiClient.post with SIGNUP_ROUTE, body and withCredentials on Signup click", async () => {
      const user = userEvent.setup();
      apiClient.post.mockResolvedValue({ status: 201 });
      render(<Auth />);

      await user.type(screen.getByPlaceholderText(/^email$/i), "u@t.com");
      await user.type(screen.getByPlaceholderText(/^password$/i), "pwd");
      await user.click(screen.getByRole("button", { name: /signup/i }));

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith(
          SIGNUP_ROUTE,
          { email: "u@t.com", password: "pwd" },
          { withCredentials: true },
        );
      });
    });

    /** Corresponds to index.jsx lines 10–11 (initial state ""), 19–22: handleSignup sends current email and password; no client-side validation. */
    test("sends empty email and password when inputs are empty", async () => {
      const user = userEvent.setup();
      apiClient.post.mockResolvedValue({ status: 201 });
      render(<Auth />);
      await user.click(screen.getByRole("button", { name: /signup/i }));

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith(
          SIGNUP_ROUTE,
          { email: "", password: "" },
          { withCredentials: true },
        );
      });
    });

    /** Corresponds to index.jsx lines 27–29: if (response.status === 201) setMessage("Signup successful!"); and lines 71–73 rendering message. */
    test('sets message to "Signup successful!" when response status is 201', async () => {
      const user = userEvent.setup();
      apiClient.post.mockResolvedValue({ status: 201 });
      render(<Auth />);
      await user.click(screen.getByRole("button", { name: /signup/i }));

      await waitFor(() => {
        expect(screen.getByText(/signup successful!/i)).toBeInTheDocument();
      });
    });

    /** Corresponds to index.jsx lines 31–33: catch block setMessage("Signup failed. Please try again."); and lines 71–73 rendering message. */
    test('sets message to "Signup failed. Please try again." when post rejects', async () => {
      const user = userEvent.setup();
      apiClient.post.mockRejectedValue(new Error("Network error"));
      render(<Auth />);
      await user.click(screen.getByRole("button", { name: /signup/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/signup failed\. please try again\./i),
        ).toBeInTheDocument();
      });
    });

    /** Corresponds to index.jsx else branch: when response.status !== 201, message includes status; no success message. */
    test("does not show success message when response status is not 201", async () => {
      const user = userEvent.setup();
      apiClient.post.mockResolvedValue({ status: 200 });
      render(<Auth />);
      await user.click(screen.getByRole("button", { name: /signup/i }));

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalled();
        expect(
          screen.getByText(/signup failed\. please try again\. \(status: 200\)/i)
        ).toBeInTheDocument();
      });
      expect(screen.queryByText(/signup successful!/i)).not.toBeInTheDocument();
    });
  });
});
