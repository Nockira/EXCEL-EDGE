import { Request, Response, NextFunction } from "express";
import { isLoggedIn } from "./isLoggedIn";
import { prisma } from "../utils/prisma.service";
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await isLoggedIn(req, res, () => {});

    //@ts-ignore
    const id = req.user.id;
    const user: any = await prisma.user.findUnique({ where: { id } });
    if (user?.role === "ADMIN") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
