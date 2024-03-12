-- CreateTable
CREATE TABLE "state_input_factors" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "groundwater_temperature" INTEGER NOT NULL,
    "average_winter_temperature" INTEGER NOT NULL,
    "solar_tank_volume_factor" DOUBLE PRECISION NOT NULL,
    "monthly_electricity_bill_cents" INTEGER NOT NULL,
    "monthly_gas_bill_cents" INTEGER NOT NULL,
    "electricity_price_cents_per_kwh" INTEGER NOT NULL,
    "gas_price_per_thousand_cubic_feet_cents" INTEGER NOT NULL,
    "propane_price_per_gallon_cents" INTEGER NOT NULL,

    CONSTRAINT "state_input_factors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "state_input_factors_state_key" ON "state_input_factors"("state");
