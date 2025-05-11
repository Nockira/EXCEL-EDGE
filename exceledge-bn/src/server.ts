import { app, prisma } from "./app";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "UPDATE"],
  },
});


io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

export const emitEvent = (eventName: string, payload: any) => {
  io.emit(eventName, payload);
};

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📘 API docs: http://localhost:${port}/api-docs`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
