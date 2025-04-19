import { Router } from "express";

const contactRouter = Router();

import {
  createContactRequest,
  getAllNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getUnreadNotification,
} from "../controllers/contact.controller";
import { validateSchema } from "../middlewares/schemaValidation";
import { contactRequestSchema } from "../schemas/contacts.schema";

contactRouter.post(
  "/contact-request",
  validateSchema(contactRequestSchema),
  createContactRequest
);
contactRouter.get("/notifications", getAllNotification);
contactRouter.get("/notifications/unread", getUnreadNotification);
contactRouter.patch("/notifications/:id", updateNotification);
contactRouter.delete("/notifications/:id", deleteNotification);
export default contactRouter;
