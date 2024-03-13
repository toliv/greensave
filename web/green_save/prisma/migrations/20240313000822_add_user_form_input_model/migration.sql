-- CreateTable
CREATE TABLE "user_form_submission" (
    "id" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "household_size" TEXT NOT NULL,
    "supported_energy_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vent_type" TEXT,
    "supported_energy_supply" TEXT NOT NULL,
    "heater_space_restrictions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_form_submission_pkey" PRIMARY KEY ("id")
);
