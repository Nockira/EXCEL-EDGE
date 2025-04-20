import { Request, Response } from "express";
import { login, register, registerWithGoogle } from "../services/auth.service";
import { Profile } from "passport-google-oauth20";
import { ILogin, IRegisterUser } from "../../types";
import { generateToken } from "../helper/tokenGenerator";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const userData: IRegisterUser = req.body;
    const newUser = await register(userData);
    const token = await generateToken(userData);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(errorMessage.includes("already exists") ? 409 : 500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to register user",
    });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const profile = req.user as Profile;

    const user = await registerWithGoogle(profile);
    const token = await generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error authenticating with Google");
  }
};
export const userLogin = async (req: Request, res: Response) => {
  const loginData: ILogin = req.body;
  try {
    const response: any = await login(loginData);
    if (!response) {
      res.status(401).json({
        status: 401,
        message: "Invalid credentials!",
      });
    } else if (response === false) {
      res.status(401).json({
        message: "Invalid credentials!",
      });
    } else {
      const accessToken = await generateToken(response);
      res.status(200).json({
        message: "Welcome😊!",
        accessToken,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
