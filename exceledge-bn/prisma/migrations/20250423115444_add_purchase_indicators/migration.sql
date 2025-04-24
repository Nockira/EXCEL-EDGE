/*
  Warnings:

  - You are about to drop the column `isParchased` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isParchased",
ADD COLUMN     "isPurchased" BOOLEAN DEFAULT false;
