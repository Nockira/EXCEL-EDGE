import cron from "node-cron";
import * as transactionService from "../../services/transaction.service";

export class TransactionCronService {
  // Initialize cron jobs
  static initCronJobs() {
    // Schedule job to run every day at midnight (00:00)
    cron.schedule("0 0 * * *", async () => {
      try {
        console.log("Running daily transaction remaining time update");
        const result = await transactionService.updateRemainingTimeDaily();
        console.log(
          `Updated remaining time for ${result.updated} transactions`
        );
      } catch (error) {
        console.error("Error updating transaction remaining time:", error);
      }
    });

    console.log("Transaction cron jobs initialized");
  }
}

export default TransactionCronService;
