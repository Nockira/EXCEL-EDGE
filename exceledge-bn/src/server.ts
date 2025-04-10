import { app, prisma } from "./app";
import TransactionCronService from "./utils/jobs/croneJob";
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on : http://localhost:${port}`);
  console.log(`API docs are available at http://localhost:${port}/api-docs`);
});
// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
