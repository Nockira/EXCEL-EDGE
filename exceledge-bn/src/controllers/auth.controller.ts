import { Request, Response } from "express";
import { login, register, registerWithGoogle } from "../services/auth.service";
import { Profile } from "passport-google-oauth20";
import { ILogin, IRegisterUser } from "../../types";
import { generateToken } from "../helper/tokenGenerator";
import twilio from "twilio";
import { prisma } from "../utils/prisma.service";
import { generateOTP } from "../utils/genetateOtp";
import africastalking from "africastalking";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

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

const at = africastalking({
  apiKey:
    "atsk_41cee26752232154525bfb9f48e338b9046a84a214867c5fa5ddbe9af4b7290df238994e", // Replace with your API key
  username: "sandbox", // 'sandbox' for testing
});
const sms = at.SMS;

export const requestOtp = async (req: Request, res: Response) => {
  const { phone, resend = false } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      res
        .status(404)
        .json({ message: "User not found with this phone number" });
    }

    const existingOTP = await prisma.passwordReset.findFirst({
      where: {
        phone,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resend && existingOTP) {
      const timeLeft = Math.ceil(
        (existingOTP.expiresAt.getTime() - new Date().getTime()) / 1000
      );
      res.status(429).json({
        message: `An OTP has already been sent. Please wait ${timeLeft} seconds before requesting a new one.`,
        expiresAt: existingOTP.expiresAt,
      });
    } else {
    }
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Delete any existing password reset entries for this phone
    await prisma.passwordReset.deleteMany({
      where: { phone },
    });
    await prisma.passwordReset.create({
      data: {
        phone,
        token: hashedOTP,
        expiresAt,
      },
    });

    try {
      // Send OTP
      const sendOtp = async (phone: string, otpCode: number) => {
        try {
          const result = await sms.send({
            to: [phone],
            message: `Your OTP code is ${otpCode}`,
            from: "", // Leave blank in sandbox mode
          });
          console.log("SMS Sent:", result);
        } catch (err) {
          console.error("SMS Error:", err);
        }
      };

      // Example usage
      // Rwandan test number (you must add this in sandbox)
      const otp = Math.floor(100000 + Math.random() * 900000); // random 6-digit OTP

      sendOtp(phone, otp);

      res.status(200).json({
        message: "OTP sent successfully",
        expiresAt,
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error requesting OTP:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
