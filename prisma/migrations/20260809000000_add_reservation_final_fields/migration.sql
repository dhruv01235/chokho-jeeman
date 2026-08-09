-- AlterEnum
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'BOOKED';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'COMPLETED';

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "reservationId" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "name" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "email" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "phone" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "timeSlot" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "tableInfo" TEXT;
ALTER TABLE "Reservation" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Reservation" ALTER COLUMN "status" SET DEFAULT 'BOOKED';

-- UpdateExisting
UPDATE "Reservation" SET "reservationId" = 'CJ-2026-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)) WHERE "reservationId" IS NULL;
UPDATE "Reservation" SET "name" = 'Guest' WHERE "name" IS NULL;
UPDATE "Reservation" SET "email" = 'guest@chokhojeeman.com' WHERE "email" IS NULL;
UPDATE "Reservation" SET "timeSlot" = '12:00 PM' WHERE "timeSlot" IS NULL;

-- SetNotNull
ALTER TABLE "Reservation" ALTER COLUMN "reservationId" SET NOT NULL;
ALTER TABLE "Reservation" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "Reservation" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "Reservation" ALTER COLUMN "timeSlot" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationId_key" ON "Reservation"("reservationId");
