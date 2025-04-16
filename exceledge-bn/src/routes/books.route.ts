import { Router } from "express";
import {
  create,
  findAll,
  findOne,
  remove,
  search,
  update,
} from "../controllers/books.controller";
import { validateSchema } from "../middlewares/schemaValidation";
import { createBookSchema, updateBookSchema } from "../schemas/booksSchema";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isAdmin } from "../middlewares/isAdmin";
import { uploadBookAssets } from "../middlewares/uploadFiles";
const bookRoutes = Router();
bookRoutes.post(
  "/",
  isLoggedIn,
  isAdmin,
  uploadBookAssets,
  validateSchema(createBookSchema),
  create
);
bookRoutes.get("/", findAll);
bookRoutes.get("/search", search);
bookRoutes.get("/:id", isLoggedIn, findOne);
bookRoutes.patch(
  "/:id",
  isLoggedIn,
  isAdmin,
  uploadBookAssets,
  validateSchema(updateBookSchema),
  update
);
bookRoutes.delete("/:id", isLoggedIn, isAdmin, remove);

export default bookRoutes;
