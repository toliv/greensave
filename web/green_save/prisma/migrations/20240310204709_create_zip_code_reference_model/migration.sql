-- CreateTable
CREATE TABLE "zip_code_references" (
    "id" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "city_name" TEXT NOT NULL,
    "state_abbreviation" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,
    "is_sun_belt_location" BOOLEAN NOT NULL,

    CONSTRAINT "zip_code_references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zip_code_references_zip_code_key" ON "zip_code_references"("zip_code");
