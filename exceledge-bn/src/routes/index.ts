import { Router } from "express";
import userRoutes from "./auth.route";
import transactionRoutes from "./transaction.route";
const appRoutes = Router();
appRoutes.use("/users", userRoutes);
appRoutes.use("/transactions", transactionRoutes);
export default appRoutes;
