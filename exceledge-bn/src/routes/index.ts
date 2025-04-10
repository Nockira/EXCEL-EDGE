import { Router } from "express";
import userRoutes from "./auth.route";
const appRoutes = Router();
appRoutes.use("/users", userRoutes);
export default appRoutes;
