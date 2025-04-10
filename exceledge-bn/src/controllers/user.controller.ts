import { Response, Request } from "express";
import {
  getUsers,
  getSingleUser,
  deleteUser,
  updateUser,
} from "../services/user.service";
import redisClient from "../utils/connectRedis";

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();

    res.status(200).json({
      message: "Users retrieved successful",
      data: {
        totalUsers: users?.length,
        users,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
};

export const updateUserDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const result = await updateUser(id, userData);

    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.data,
      });
    }
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await getSingleUser(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    } else {
      res.status(200).json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
