require("dotenv").config();
import "./configs/passport";
import express, { Response } from "express";
import { validateEnv } from "./utils/validateEnv";
import cors from "cors";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
import appRoutes from "./routes";
import passport from "passport";
import session from "express-session";
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");
import TransactionCronService from "./utils/jobs/croneJob";

validateEnv();
TransactionCronService.initCronJobs();

const prisma = new PrismaClient();
const app = express();
const swaggerDocument = YAML.load("openapi.yaml");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
      pruneSessionInterval: 60 * 15,
    }),
    secret: process.env.SESSION_SECRET || "kjhgfdfghjkllkjhgfdsasdfgh",
    resave: false,
    saveUninitialized: false, // Better for GDPR compliance
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", appRoutes);

app.get("/api/v1/health-check", async (_, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
  });
});

export { app, prisma };
