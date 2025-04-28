import { prisma } from "../utils/prisma.service";
import { IRegisterUser } from "../../types";
import { User } from "@prisma/client";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getSingleUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
export const updateUser = async (id: string, userData: Partial<User>) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        message: `User with ID ${id} not found`,
      };
    }

    if (userData.phone && userData.phone !== existingUser.phone) {
      const phoneTaken = await prisma.user.findFirst({
        where: {
          phone: userData.phone,
          NOT: { id },
        },
      });

      if (phoneTaken) {
        return {
          success: false,
          message: "Phone number is already in use by another user",
        };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName: userData.firstName ?? existingUser.firstName,
        secondName: userData.secondName ?? existingUser.secondName,
        email: userData.email ?? existingUser.email,
        phone: userData.phone ?? existingUser.phone,
        password: userData.password ?? existingUser.password,
        gender: userData.gender ?? existingUser.gender,
        dob: userData.dob ? new Date(userData.dob) : existingUser.dob,
        role: userData.role ?? existingUser.role,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        message: `User with ID ${id} not found`,
      };
    } else {
      await prisma.user.delete({
        where: { id },
      });
      return { success: true };
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
