import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import { app } from "../src/app";

import redisClient from "../src/utils/connectRedis";

describe("Health Check", () => {
  it("should respond with success", async () => {
    const res = await request(app).get("/api/v1/health-check");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });

  it("should return a message from Redis", async () => {
    await redisClient.set("try", "Redis is working!");
    const res = await request(app).get("/api/v1/health-check");
    expect(res.body.message).toBe("Redis is working!");
  });
  afterAll(async () => {
    await redisClient.quit();
  });
});
