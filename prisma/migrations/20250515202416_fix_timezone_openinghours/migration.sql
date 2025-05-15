/*
  Warnings:

  - Changed the type of `openTime` on the `OpeningHours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `closeTime` on the `OpeningHours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OpeningHours" DROP COLUMN "openTime",
ADD COLUMN     "openTime" TIMESTAMPTZ NOT NULL,
DROP COLUMN "closeTime",
ADD COLUMN     "closeTime" TIMESTAMPTZ NOT NULL;
