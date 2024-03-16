/*
  Warnings:

  - You are about to drop the column `created_at` on the `user_form_submission` table. All the data in the column will be lost.
  - You are about to drop the column `heater_space_restrictions` on the `user_form_submission` table. All the data in the column will be lost.
  - You are about to drop the column `household_size` on the `user_form_submission` table. All the data in the column will be lost.
  - You are about to drop the column `supported_energy_supply` on the `user_form_submission` table. All the data in the column will be lost.
  - You are about to drop the column `supported_energy_types` on the `user_form_submission` table. All the data in the column will be lost.
  - You are about to drop the column `vent_type` on the `user_form_submission` table. All the data in the column will be lost.
  - You are about to drop the column `zipcode` on the `user_form_submission` table. All the data in the column will be lost.
  - Added the required column `submission_data` to the `user_form_submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_form_submission" DROP COLUMN "created_at",
DROP COLUMN "heater_space_restrictions",
DROP COLUMN "household_size",
DROP COLUMN "supported_energy_supply",
DROP COLUMN "supported_energy_types",
DROP COLUMN "vent_type",
DROP COLUMN "zipcode",
ADD COLUMN     "submission_data" JSONB NOT NULL;
