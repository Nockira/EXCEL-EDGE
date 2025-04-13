// __tests__/health-check.test.ts

import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import request from "supertest";
import { app } from "../src/app";

// Mock cron jobs
jest.mock("node-cron", () => {
  return {
    schedule: jest.fn(() => ({
      stop: jest.fn(),
    })),
  };
});

describe("Health Check", () => {
  it("should respond with success", async () => {
    const res = await request(app).get("/api/v1/health-check");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });
});
afterAll(() => {
  setTimeout(() => {
    process.exit(0);
  }, 500);
});
