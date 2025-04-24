import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";
import axios from "axios";
import * as cron from "node-cron";
import { emitEvent } from "../server";
import { prisma } from "../utils/prisma.service";
import { updateUserSubscription } from "../helper/updateUsersSub";
import { ServiceType } from "../../types";
let currentJob: any = null;
// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { duration, service } = req.body;

    if (!duration || !service) {
      res.status(400).json({ message: "Missing required fields" });
    }
    const user: any = req.user;
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Get all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    res.status(200).json(transaction);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Get transactions by user ID
export const getTransactionsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const transactions = await transactionService.getTransactionsByUserId(
      userId
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const transaction = await transactionService.updateTransaction(
      id,
      updateData
    );
    res.status(200).json(transaction);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Update payment status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, remainingTime } = req.body;

    if (!status) {
      res.status(400).json({ message: "Status is required" });
    }

    const transaction = await transactionService.updatePaymentStatus(
      id,
      status,
      remainingTime
    );
    res.status(200).json(transaction);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await transactionService.deleteTransaction(id);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

export const updateRemainingTimeDaily = async () => {
  // Decrement remaining time
  await prisma.transaction.updateMany({
    where: {
      status: "COMPLETED",
      remainingTime: { gt: 0 },
    },
    data: { remainingTime: { decrement: 1 } },
  });

  // Handle expired subscriptions
  const expiredSubscriptions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      remainingTime: 0,
    },
    include: { user: true },
  });

  for (const sub of expiredSubscriptions) {
    await updateUserSubscription(sub.userId, sub.service as ServiceType, false);
    emitEvent("subscription-expired", {
      userId: sub.userId,
      service: sub.service,
    });
  }

  return { updated: true };
};

// Payment controllers
const getPaymentToken = async () => {
  try {
    const response: any = await axios.post(
      `${process.env.PAYPACK_API}/auth/agents/authorize`,
      {
        client_id: process.env.PAYPACK_CLIENT_ID,
        client_secret: process.env.PAYPACK_SECRET_KEY,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const token = response.data.access;
    return token;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to get access token:", error.message);
    } else {
      console.error("Failed to get access token:", error);
    }
    throw error;
  }
};

export const initializePayment = async (req: Request, res: Response) => {
  const accessToken = await getPaymentToken();
  const { amount, number, duration, service } = req.body;
  try {
    const paypackResponse = await axios.post(
      `${process.env.PAYPACK_API}/transactions/cashin`,
      { amount, number },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const paypackData: any = paypackResponse.data;

    // Record transaction in DB
    const user: any = req.user;
    const method = paypackData?.provider?.toUpperCase?.() || "UNKNOWN";
    const transaction = await transactionService.createTransaction({
      id: paypackData?.ref,
      userId: user.id,
      amount,
      method,
      duration,
      service,
    });
    fetchEventJob(paypackData?.ref, number, duration);
    res.status(201).json({
      message: "Payment initiated and transaction recorded successfully.",
      paypack: paypackData,
      transaction,
    });
  } catch (error: any) {
    console.error(
      "Payment Init Error: ",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      message: "Failed to initialize payment",
      details: error.response?.data || error.message,
    });
  }
};

export const fetchPaypackEvents = async (
  ref: string,
  client: string,
  time: number
) => {
  const accessToken = await getPaymentToken();
  try {
    const response: any = await axios.get(
      `${process.env.PAYPACK_API}/events/transactions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          ref,
          client,
        },
      }
    );

    const events: any = response.data.transactions[0]?.data;
    if (!events) {
      console.log("⚠️ No matching event found.");
      return;
    }
    const status = events.status;
    if (status === "successful" || status === "failed") {
      const dbStatus = status === "successful" ? "COMPLETED" : "FAILED";
      const remainingPeriod = status === "successful" ? time * 30 : 0;
      console.log("Remaining time ", time * 30);
      await transactionService.updatePaymentStatus(
        ref,
        dbStatus,
        remainingPeriod
      );
      emitEvent("payment-status-update", {
        status: dbStatus,
        remainingPeriod,
      });
      currentJob?.stop();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Paypack events:", error.message);
    } else {
      console.error("Error fetching Paypack events:", error);
    }
  }
};

export const checkSubscriptionStatus = async (
  userId: string,
  service: any
): Promise<any> => {
  const activeSubscription = await prisma.transaction.findFirst({
    where: {
      userId,
      service,
      status: "COMPLETED",
      remainingTime: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    isActive: !!activeSubscription,
    remainingDays: activeSubscription?.remainingTime || 0,
    expiresAt: activeSubscription
      ? new Date(Date.now() + activeSubscription.remainingTime * 86400000)
      : null,
  };
};

export const fetchEventJob = (a: string, b: string, c: number) => {
  console.log("Fetching event clone job started .....");
  // Runs every 1 minutes
  currentJob = cron.schedule("*/1 * * * *", async () => {
    console.log("⏰ Checking Paypack events...");
    await fetchPaypackEvents(a, b, c);
  });
};
