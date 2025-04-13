import { Router } from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isAdmin } from "../middlewares/isAdmin";
import { validateSchema } from "../middlewares/schemaValidation";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../schemas/announcement.schema";

const announcementRoutes = Router();

announcementRoutes.post(
  "/",
  isLoggedIn,
  validateSchema(createAnnouncementSchema),
  createAnnouncement
);
announcementRoutes.get("/", getAnnouncements);
announcementRoutes.get("/:id", getAnnouncementById);
announcementRoutes.patch(
  "/:id",
  isLoggedIn,
  validateSchema(updateAnnouncementSchema),
  updateAnnouncement
);
announcementRoutes.delete("/:id", isLoggedIn, deleteAnnouncement);

export default announcementRoutes;
