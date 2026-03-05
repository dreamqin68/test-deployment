import request from "supertest";
import { app, connectDB, User } from "../app.js";
import mongoose from "mongoose";

/**
 * Feature tests for POST /api/auth/signup. Uses @shelf/jest-mongodb (process.env.MONGO_URL).
 * jest.config.cjs references @shelf/jest-mongodb as a preset.
 */
describe("POST /api/auth/signup", () => {
  beforeAll(async () => {
    await connectDB(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
    jest.restoreAllMocks();
  });

  /**
   * Corresponds to app.js lines 49–52: create new user, save to DB, return 201 and "User registered successfully".
   * Also verifies the user is persisted (User.findOne).
   */
  it("should create a user and return 201 if email/password are valid", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "john@example.com", password: "secret123" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");

    const userInDb = await User.findOne({ email: "john@example.com" });
    expect(userInDb).not.toBeNull();
  });

  /**
   * Corresponds to app.js lines 43–46: existingUser branch — User.findOne returns a user, return 409 "Email already registered".
   */
  it("should return 409 if email is already registered", async () => {
    await User.create({ email: "jane@example.com", password: "pass" });

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "jane@example.com", password: "newpass" });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already registered");
  });

  /**
   * Corresponds to app.js lines 36–40: validation branch — if !email or !password, return 400 "Email and password are required".
   */
  it("should return 400 if email or password is missing", async () => {
    let res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "missingpass@example.com" });
    expect(res.status).toBe(400);

    res = await request(app)
      .post("/api/auth/signup")
      .send({ password: "newpass" });
    expect(res.status).toBe(400);
  });

  /**
   * Corresponds to app.js lines 53–56: catch block — when save() (or findOne) throws, return 500 "Internal Server Error".
   */
  it("should return 500 and 'Internal Server Error' if an exception occurs during signup", async () => {
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValueOnce(new Error("Forced save error"));

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "error@example.com", password: "secret" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");
  });
});
