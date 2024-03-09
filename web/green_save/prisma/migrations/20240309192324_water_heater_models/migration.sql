-- CreateTable
CREATE TABLE "water_heaters" (
    "id" TEXT NOT NULL,
    "energy_star_unique_id" TEXT NOT NULL,
    "energy_star_partner" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "model_number" TEXT NOT NULL,
    "heater_type" TEXT NOT NULL,
    "uniform_energy_factor" DOUBLE PRECISION NOT NULL,
    "upc" TEXT,
    "rating_out_of_5" DOUBLE PRECISION,
    "review_count" INTEGER,
    "heat_pump_type" TEXT,
    "fuel_type" TEXT,
    "vent_type" TEXT,
    "storage_volume_gallons" INTEGER,
    "first_hour_rating_gallons" INTEGER,
    "max_gallons_per_minute" DOUBLE PRECISION,
    "parent_energy_star_id" TEXT,
    "input_voltage_hpwh" INTEGER,
    "tank_height_inches" DOUBLE PRECISION,
    "tank_diameter_inches" DOUBLE PRECISION,

    CONSTRAINT "water_heaters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_heater_price_records" (
    "id" TEXT NOT NULL,
    "water_heater_id" TEXT NOT NULL,
    "price_in_cents" INTEGER NOT NULL,
    "source_url" TEXT,
    "date_recorded" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "water_heater_price_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "water_heaters_energy_star_unique_id_key" ON "water_heaters"("energy_star_unique_id");

-- AddForeignKey
ALTER TABLE "water_heater_price_records" ADD CONSTRAINT "water_heater_price_records_water_heater_id_fkey" FOREIGN KEY ("water_heater_id") REFERENCES "water_heaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
