import { IRegisterUser } from "../../types";
import jwt from "jsonwebtoken";
export const generateToken = async (user: any) => {
  const secretKey =
    process.env.JWT_SECRET || "123e4567-e89b-12d3-a456-426614174000";
  const expiresIn = "48h";

  const payload = {
    id: user.id,
    firstName: user.firstName,
    secondName: user.secondName,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secretKey, { expiresIn });
};
