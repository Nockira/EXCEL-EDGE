import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updatePaymentStatus,
  updateTransaction,
  getTransactionById,
} from "../controllers/transaction.controller";
import { validateSchema } from "../middlewares/schemaValidation";
import {
  createTransactionSchema,
  updateStatusSchema,
  updateTransactionSchema,
} from "../schemas/transactions.schema";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isAdmin } from "../middlewares/isAdmin";

const transactionRoutes = Router();
transactionRoutes.get("/", isLoggedIn, getTransactions);
transactionRoutes.get("/:id", isLoggedIn, getTransactionById);
transactionRoutes.post(
  "/",
  validateSchema(createTransactionSchema),
  isLoggedIn,
  createTransaction
);
transactionRoutes.patch(
  "/:id",
  isLoggedIn,
  validateSchema(updateTransactionSchema),
  updateTransaction
);
transactionRoutes.patch(
  "/:id/status",
  isLoggedIn,
  validateSchema(updateStatusSchema),
  updatePaymentStatus
);
transactionRoutes.delete("/:id", isLoggedIn, isAdmin, deleteTransaction);

export default transactionRoutes;
