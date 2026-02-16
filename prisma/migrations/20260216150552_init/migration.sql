/*
  Warnings:

  - You are about to drop the column `emailOtp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailOtpExpires` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailOtp",
DROP COLUMN "emailOtpExpires";
