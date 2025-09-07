/*
  Warnings:

  - You are about to drop the `BusinessLogo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BusinessLogo" DROP CONSTRAINT "BusinessLogo_businessId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "logo" TEXT;

-- DropTable
DROP TABLE "BusinessLogo";
