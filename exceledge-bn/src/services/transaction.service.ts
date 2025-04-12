import { prisma } from "../utils/prisma.service";
interface CreateTransactionDto {
  id: string;
  userId: string;
  amount: number;
  method: any;
  duration: number;
  service: string;
}

interface UpdateTransactionDto {
  status?: any;
  amount?: number;
  method?: any;
  duration?: number;
  service?: string;
}

export const createTransaction = async (
  createTransactionDto: CreateTransactionDto
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: createTransactionDto.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const transaction = await prisma.transaction.create({
      data: {
        id: createTransactionDto.id,
        userId: createTransactionDto.userId,
        amount: createTransactionDto.amount,
        method: createTransactionDto.method,
        duration: createTransactionDto.duration,
        remainingTime: 0,
        service: createTransactionDto.service,
      },
    });

    return transaction;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create transaction");
  }
};

export const getAllTransactions = async () => {
  const transactions = await prisma.transaction.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          secondName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const transactionsCompleted = await prisma.transaction.aggregate({
    where: {
      status: "COMPLETED",
    },
    _sum: {
      amount: true,
    },
  });
  const transactionsPending = await prisma.transaction.aggregate({
    where: {
      status: "PENDING",
    },
    _sum: {
      amount: true,
    },
  });
  const transactionsFailed = await prisma.transaction.aggregate({
    where: {
      status: "FAILED",
    },
    _sum: {
      amount: true,
    },
  });

  const totalRevenue = transactionsCompleted._sum.amount || 0;
  const totalFailed = transactionsFailed._sum.amount || 0;
  const totalPending = transactionsPending._sum.amount || 0;
  return {
    transactions,
    totalRevenue,
    totalPending,
    totalFailed,
  };
};

export const getTransactionById = async (id: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          secondName: true,
        },
      },
    },
  });

  if (!transaction) {
    throw new Error(`Transaction with ID ${id} not found`);
  }

  return transaction;
};

export const getTransactionsByUserId = async (userId: string) => {
  return await prisma.transaction.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          secondName: true,
        },
      },
    },
  });
};

export const updateTransaction = async (
  id: string,
  updateTransactionDto: UpdateTransactionDto
) => {
  try {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    // If duration is updated, recalculate remaining time
    let remainingTime;
    if (updateTransactionDto.duration) {
      remainingTime = updateTransactionDto.duration * 30;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...updateTransactionDto,
        ...(remainingTime && { remainingTime }),
      },
    });

    return transaction;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update transaction");
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return { message: "Transaction deleted successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete transaction");
  }
};

export const updatePaymentStatus = async (
  id: string,
  status: any,
  remainingTime: number
) => {
  try {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: { status, remainingTime },
    });

    return transaction;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update payment status");
  }
};

// Method for cron job to update remaining time daily
export const updateRemainingTimeDaily = async () => {
  try {
    // Get all active transactions (COMPLETED status with remaining time > 0)
    const activeTransactions = await prisma.transaction.findMany({
      where: {
        status: "COMPLETED",
        remainingTime: { gt: 0 },
      },
    });

    // Update each transaction by decrementing remainingTime by 1
    for (const transaction of activeTransactions) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { remainingTime: { decrement: 1 } },
      });
    }

    return { updated: activeTransactions.length };
  } catch (error) {
    throw new Error("Failed to update remaining time");
  }
};
