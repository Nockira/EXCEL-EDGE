import { prisma } from "../utils/prisma.service";
import { hashPassword, isPasswordMatch } from "../utils/hashPassword";
import { User } from "@prisma/client";
import { Profile } from "passport-google-oauth20";
import { ILogin, IRegisterUser } from "../../types";

export const register = async (
  userData: IRegisterUser
): Promise<IRegisterUser> => {
  if (userData.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }
  }

  if (userData.phone) {
    const userWithPhone = await prisma.user.findUnique({
      where: { phone: userData.phone },
    });

    if (userWithPhone) {
      throw new Error("User with this phone number already exists");
    }
  }
  const hashedPassword = await hashPassword(userData.password);
  const newUser = await prisma.user.create({
    data: {
      firstName: userData.firstName || "",
      secondName: userData.secondName || "",
      email: userData.email || "",
      phone: userData.phone,
      password: hashedPassword,
      gender: userData.gender,
      dob: userData.dob ? new Date(userData.dob) : null,
      role: "USER",
    },
  });
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword as any;
};
export const registerWithGoogle = async (
  googleData: Profile
): Promise<User> => {
  try {
    const { displayName, emails } = googleData;
    let user = await prisma.user.findUnique({
      where: { email: emails?.[0].value },
    });

    if (user) {
      return user;
    }
    const newUser = await prisma.user.create({
      data: {
        email: emails?.[0].value,
        firstName: displayName.split(" ")[0],
        secondName: displayName.split(" ")[1] || "",
        password: await hashPassword(Math.random().toString(36)),
        gender: null,
        dob: null,
        role: "USER",
      },
    });

    return newUser;
  } catch (error) {
    console.error("Google authentication error:", error);
    throw new Error("Failed to authenticate with Google");
  }
};

export const login = async (data: ILogin) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });
    if (!user) {
      return null;
    } else {
      const isMatch = await isPasswordMatch(data.password, user?.password);
      if (isMatch) {
        return user;
      } else {
        return false;
      }
    }
  } catch (error) {
    throw new Error("Error occured during login");
  }
};
