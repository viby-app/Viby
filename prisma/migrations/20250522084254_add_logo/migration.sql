-- CreateTable
CREATE TABLE "BusinessLogo" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "BusinessLogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessLogo_businessId_key" ON "BusinessLogo"("businessId");

-- AddForeignKey
ALTER TABLE "BusinessLogo" ADD CONSTRAINT "BusinessLogo_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
