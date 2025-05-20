/*
  Warnings:

  - You are about to drop the column `name` on the `Workers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Workers` table. All the data in the column will be lost.
  - Added the required column `workerId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Workers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "workerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Workers" DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Workers" ADD CONSTRAINT "Workers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
