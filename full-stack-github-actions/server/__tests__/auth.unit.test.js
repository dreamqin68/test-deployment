/**
 * Unit tests for app.js: signup handler and connectDB in isolation with mocked mongoose/User.
 * Corresponds to app.js signup (lines 32–57) and connectDB (lines 69–71).
 */

const mockFindOne = jest.fn();
const mockSave = jest.fn();

function MockUser() {
  this.save = mockSave;
}
MockUser.findOne = mockFindOne;

jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue(undefined),
  Schema: function Schema() {},
  model: jest.fn(() => MockUser),
}));

// Import after mock so app.js gets the mocked mongoose
import { signup, connectDB } from "../app.js";

describe("Auth (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSave.mockResolvedValue(undefined);
  });

  describe("signup handler", () => {
    /** Corresponds to app.js lines 36–40: validation branch when email or password is missing */
    it("returns 400 and 'Email and password are required' when email is missing", async () => {
      const req = { body: { password: "secret" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
      expect(mockFindOne).not.toHaveBeenCalled();
    });

    /** Corresponds to app.js lines 36–40: validation branch when password is missing */
    it("returns 400 and 'Email and password are required' when password is missing", async () => {
      const req = { body: { email: "a@b.co" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
      expect(mockFindOne).not.toHaveBeenCalled();
    });

    /** Corresponds to app.js lines 43–46: existingUser branch → 409 Conflict */
    it("returns 409 and 'Email already registered' when user already exists", async () => {
      mockFindOne.mockResolvedValue({ email: "jane@example.com" });
      const req = { body: { email: "jane@example.com", password: "pass" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await signup(req, res);

      expect(mockFindOne).toHaveBeenCalledWith({ email: "jane@example.com" });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email already registered",
      });
      expect(mockSave).not.toHaveBeenCalled();
    });

    /** Corresponds to app.js lines 49–52: success path – create user and return 201 */
    it("returns 201 and 'User registered successfully' when email/password are valid and user does not exist", async () => {
      mockFindOne.mockResolvedValue(null);
      const req = {
        body: { email: "new@example.com", password: "secret123" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await signup(req, res);

      expect(mockFindOne).toHaveBeenCalledWith({ email: "new@example.com" });
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
    });

    /** Corresponds to app.js lines 53–56: catch block when save (or findOne) throws */
    it("returns 500 and 'Internal Server Error' when save throws", async () => {
      mockFindOne.mockResolvedValue(null);
      mockSave.mockRejectedValue(new Error("DB error"));
      const req = {
        body: { email: "new@example.com", password: "secret123" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
      consoleSpy.mockRestore();
    });
  });

  describe("connectDB", () => {
    /** Corresponds to app.js lines 69–71: mongoose.connect(uri) */
    it("calls mongoose.connect with the given uri", async () => {
      const mongoose = await import("mongoose");
      const uri = "mongodb://localhost:27017/test";

      await connectDB(uri);

      expect(mongoose.default.connect).toHaveBeenCalledWith(uri);
    });
  });
});
