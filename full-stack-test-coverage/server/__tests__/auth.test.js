import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app, connectDB, User } from "../app.js";
import mongoose from "mongoose";

/**
 * We rely on @shelf/jest-mongodb to supply process.env.MONGO_URL,
 * which points to an in-memory MongoDB instance for testing.
 *
 * jest.config.cjs references @shelf/jest-mongodb as a preset,
 */

/**
 * This describe block groups tests for the signup endpoint: POST /api/auth/signup
 */
describe("POST /api/auth/signup", () => {
  /**
   * Before any of our tests run, we connect Mongoose to the ephemeral MongoDB
   * instance provided by process.env.MONGO_URL. The connectDB function is
   * defined in `app.js`, so we just call it here.
   */
  beforeAll(async () => {
    await connectDB(process.env.MONGO_URL);
  });

  /**
   * After all tests complete, we disconnect from MongoDB to free resources
   * and ensure no open handles remain (important in Jest).
   */
  afterAll(async () => {
    await mongoose.disconnect();
  });

  /**
   * We clear out all users between tests so each test starts with a fresh DB.
   * This helps prevent one test's data from affecting another.
   */
  afterEach(async () => {
    await User.deleteMany({});
  });

  /**
   * 1) Test the success scenario:
   *    If the request has valid email and password, the endpoint should
   *    create a user and return status 201 with a success message.
   */
  it("should create a user and return 201 if email/password are valid", async () => {
    /**
     * We use supertest to POST to /api/auth/signup on our Express `app`.
     * The `send({...})` method includes the JSON body with email/password.
     */
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "john@example.com", password: "secret123" });

    // We expect a 201 (Created) status code
    expect(res.status).toBe(201);
    // We also expect the response body to have a message with success text
    expect(res.body.message).toBe("User registered successfully");

    /**
     * Verify in the database that the user actually got created.
     * We query the User model for the given email and ensure it's not null.
     */
    const userInDb = await User.findOne({ email: "john@example.com" });
    expect(userInDb).not.toBeNull();
  });

  /**
   * 2) Test the scenario where the email is already registered:
   *    In that case, the endpoint should return a 400 (Bad Request)
   *    and a message indicating the email is taken.
   */
  it("should return 400 if email is already registered", async () => {
    // First, manually create a user document in the in-memory DB
    await User.create({ email: "jane@example.com", password: "pass" });

    // Now, attempt to sign up again with the same email
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "jane@example.com", password: "newpass" });

    // Expect 400 status code for a duplicate email scenario
    expect(res.status).toBe(400);
    // And check the message for "Email already registered"
    expect(res.body.message).toBe("Email already registered");
  });

  /**
   * 3) Test the scenario where the request is missing an email or a password:
   *    The endpoint should respond with a 400 for either missing field.
   */
  it("should return 400 if email or password is missing", async () => {
    // Missing password
    let res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "missingpass@example.com" });
    expect(res.status).toBe(400);

    // Missing email
    res = await request(app)
      .post("/api/auth/signup")
      .send({ password: "newpass" });
    expect(res.status).toBe(400);
  });
});
