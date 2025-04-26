import { Request, Response, NextFunction, RequestHandler } from "express";
import { checkSubscriptionStatus } from "../controllers/transaction.controller";

export const requireSubscription = (service: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    const status = await checkSubscriptionStatus(user.id, service);

    if (!status.isActive && user.role !== "ADMIN") {
      res.status(403).json({
        message: `Subscription required for ${service} service`,
      });
    }

    next();
  };
};
