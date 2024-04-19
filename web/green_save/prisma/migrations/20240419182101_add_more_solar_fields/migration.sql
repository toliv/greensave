-- AlterTable
ALTER TABLE "water_heaters" ADD COLUMN     "solar_collector_panel_area_sq_ft" DOUBLE PRECISION,
ADD COLUMN     "solar_freeze_tolerance_limit_fahrenheit" INTEGER,
ADD COLUMN     "solar_tank_volume_gallons" INTEGER;
