-- CreateTable
CREATE TABLE "Workers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "wage" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "Workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpeningHour" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TIME NOT NULL,
    "closeTime" TIME NOT NULL,

    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClosedDay" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,

    CONSTRAINT "ClosedDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHour_businessId_dayOfWeek_key" ON "OpeningHour"("businessId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "ClosedDay_businessId_date_key" ON "ClosedDay"("businessId", "date");

-- AddForeignKey
ALTER TABLE "Workers" ADD CONSTRAINT "Workers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningHour" ADD CONSTRAINT "OpeningHour_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClosedDay" ADD CONSTRAINT "ClosedDay_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
