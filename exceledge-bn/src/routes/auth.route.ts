import { Router } from "express";
import passport from "passport";
import { validateSchema } from "../middlewares/schemaValidation";
import {
  googleAuth,
  requestOtp,
  userLogin,
  userRegister,
} from "../controllers/auth.controller";
import {
  loginSchema,
  registerUserSchema,
  updateUserSchema,
} from "../schemas/auth.schema";
import {
  fetchUsers,
  getUserById,
  removeUser,
  updateUserDetails,
} from "../controllers/user.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isAdmin } from "../middlewares/isAdmin";

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
userRoutes.get("/", isLoggedIn, fetchUsers);
userRoutes.get("/:id", isLoggedIn, getUserById);
userRoutes.patch(
  "/:id",
  isLoggedIn,
  validateSchema(updateUserSchema),
  updateUserDetails
);
userRoutes.delete("/:id", isLoggedIn, removeUser);
userRoutes.post("/request-otp", requestOtp);
export default userRoutes;
