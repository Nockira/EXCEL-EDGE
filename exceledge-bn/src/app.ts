require("dotenv").config();
import express, { Response } from "express";
import { validateEnv } from "./utils/validateEnv";
import cors from "cors";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
import redisClient from "./utils/connectRedis";
import appRoutes from "./routes";

validateEnv();

const prisma = new PrismaClient();
const app = express();
const swaggerDocument = YAML.load("openapi.yaml");

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", appRoutes);

app.get("/api/v1/health-check", async (_, res: Response) => {
  const message = await redisClient.get("try");
  res.status(200).json({
    status: "success",
    message,
  });
});

export { app, prisma };
