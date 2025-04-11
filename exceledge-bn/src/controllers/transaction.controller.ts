import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";
import axios from "axios";
import * as crypto from "crypto";
import * as cron from "node-cron";

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { duration, service } = req.body;

    if (!duration || !service) {
      res.status(400).json({ message: "Missing required fields" });
    }
    const user: any = req.user;
    console.log("the user found with the info below ===> ", user);
    // const transaction = await transactionService.createTransaction({
    //   userId: user.id,
    //   amount,
    //   method,
    //   duration,
    //   service,
    // });

    // res.status(201).json(transaction);
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
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "Status is required" });
    }

    const transaction = await transactionService.updatePaymentStatus(
      id,
      status
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

// Update remaining time (for manual triggering of cron job)
export const updateRemainingTime = async (req: Request, res: Response) => {
  try {
    const result = await transactionService.updateRemainingTimeDaily();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
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

    // Assuming Paypack returns a success status or code you can check
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
    await checkTransactionEvent(paypackData?.ref, number);
    // Return combined response
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
const checkTransactionEvent = async (ref: string, client: string) => {
  let job: cron.ScheduledTask;

  job = cron.schedule(
    "*/1 * * * *",
    async () => {
      try {
        const token = await getPaymentToken();

        // Get transaction events
        const response: any = await axios.get(
          `${process.env.PAYPACK_API}/events/transactions`,
          {
            params: {
              ref,
              client,
            },
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data.transactions);
      } catch (error: any) {
        console.error(
          `Error monitoring transaction [${ref}]:`,
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          console.log("Token expired, attempting to refresh...");
        }
      }
    },
    {
      scheduled: true,
      timezone: "Africa/Kigali",
    }
  );

  return job;
};
