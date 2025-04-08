import { Router } from "express";
import passport from "passport";
import { validateSchema } from "../middlewares/schemaValidation";
import {
  googleAuth,
  userLogin,
  userRegister,
} from "../controllers/auth.controller";
import { loginSchema, registerUserSchema } from "../schemas/auth.schema";

const userRoutes = Router();
userRoutes.post("/", validateSchema(registerUserSchema), userRegister);
userRoutes.get(
  "/google-auth",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
userRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuth
);
userRoutes.post("/login", validateSchema(loginSchema), userLogin);
export default userRoutes;
