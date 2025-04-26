/*
  Warnings:

  - You are about to drop the column `isPurchased` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isSubscribed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPurchased",
DROP COLUMN "isSubscribed",
ADD COLUMN     "hasGoogleLocationAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPurchasedBook" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSubscribedToTin" BOOLEAN NOT NULL DEFAULT false;
