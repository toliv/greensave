/*
  Warnings:

  - You are about to drop the `UserEmailRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserEmailRequest" DROP CONSTRAINT "UserEmailRequest_user_form_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "UserEmailRequest" DROP CONSTRAINT "UserEmailRequest_water_heater_id_fkey";

-- DropTable
DROP TABLE "UserEmailRequest";

-- CreateTable
CREATE TABLE "user_email_request" (
    "id" TEXT NOT NULL,
    "contact_allowed" BOOLEAN NOT NULL,
    "water_heater_id" TEXT NOT NULL,
    "user_form_submission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "resend_email_id" TEXT,

    CONSTRAINT "user_email_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_email_request" ADD CONSTRAINT "user_email_request_water_heater_id_fkey" FOREIGN KEY ("water_heater_id") REFERENCES "water_heaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_email_request" ADD CONSTRAINT "user_email_request_user_form_submission_id_fkey" FOREIGN KEY ("user_form_submission_id") REFERENCES "user_form_submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
