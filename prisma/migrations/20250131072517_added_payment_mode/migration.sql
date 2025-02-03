-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('UPI', 'CASH', 'CARD', 'BANK_TRANSFER');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'UPI';
