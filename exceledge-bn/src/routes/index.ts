import { Router } from "express";
import userRoutes from "./auth.route";
import transactionRoutes from "./transaction.route";
import announcementRoutes from "./announcement.route";
const appRoutes = Router();
appRoutes.use("/users", userRoutes);
appRoutes.use("/transactions", transactionRoutes);
appRoutes.use("/announcements", announcementRoutes);
export default appRoutes;
