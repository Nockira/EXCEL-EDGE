import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectPrisma() {
  await prisma.$connect();
}

async function disconnectPrisma() {
  await prisma.$disconnect();
}

export { prisma, connectPrisma, disconnectPrisma };
