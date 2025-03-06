import request from "supertest";
import { app, connectDB, User } from "../app.js";
import mongoose from "mongoose";

describe("POST /api/auth/signup (Extended Error Coverage)", () => {
  // Connect to the in-memory MongoDB before tests run.
  beforeAll(async () => {
    await connectDB(process.env.MONGO_URL);
  });

  // Disconnect from MongoDB after all tests.
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Clear out any users between tests.
  afterEach(async () => {
    await User.deleteMany({});
  });

  /**
   * This test simulates an error during user creation by forcing the
   * User model's save() method to throw an error. This triggers the catch
   * block in the signup controller, which should return a 500 status code
   * with the message "Internal Server Error".
   */
  it("should return 500 and 'Internal Server Error' if an exception occurs during signup", async () => {
    // Force User.prototype.save() to throw an error.
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValueOnce(new Error("Forced save error"));

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "error@example.com", password: "secret" });

    // Expect a 500 status code and the error message.
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");

    // Restore the original save method to avoid affecting other tests.
    User.prototype.save.mockRestore();
  });
});
