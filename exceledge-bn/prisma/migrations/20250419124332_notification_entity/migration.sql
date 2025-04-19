/*
  Warnings:

  - You are about to drop the column `contactRequestId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `ContactRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_contactRequestId_fkey";

-- DropIndex
DROP INDEX "Notification_contactRequestId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "contactRequestId";

-- DropTable
DROP TABLE "ContactRequest";
