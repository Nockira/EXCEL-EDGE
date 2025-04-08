import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  let retryCount = 0;

  try {
    await redisClient.connect();
    console.log("✅ Redis client connected successfully");

    await redisClient.set("try", "Welcome to Exceledge");
    console.log("📦 Redis SET successful");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Redis connection error:", error.message);
    } else {
      console.error("❌ Redis connection error:", error);
    }
    retryCount += 1;
    console.log(
      `🔁 Retrying Redis connection in 5s (attempt ${retryCount})...`
    );
    setTimeout(connectRedis, 5000);
  }
};

// Optional: Redis client events
redisClient.on("error", (err) => console.error("Redis client error:", err));
redisClient.on("connect", () => console.log("Redis client connecting..."));
redisClient.on("ready", () => console.log("Redis client ready"));

connectRedis();

export default redisClient;
