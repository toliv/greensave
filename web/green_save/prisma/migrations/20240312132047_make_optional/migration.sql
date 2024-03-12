-- AlterTable
ALTER TABLE "state_input_factors" ALTER COLUMN "monthly_electricity_bill_cents" DROP NOT NULL,
ALTER COLUMN "monthly_gas_bill_cents" DROP NOT NULL;
