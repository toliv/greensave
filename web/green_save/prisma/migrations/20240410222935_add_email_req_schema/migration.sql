-- CreateTable
CREATE TABLE "UserEmailRequest" (
    "id" TEXT NOT NULL,
    "contact_allowed" BOOLEAN NOT NULL,
    "water_heater_id" TEXT NOT NULL,
    "user_form_submission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "resend_email_id" TEXT,

    CONSTRAINT "UserEmailRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserEmailRequest" ADD CONSTRAINT "UserEmailRequest_water_heater_id_fkey" FOREIGN KEY ("water_heater_id") REFERENCES "water_heaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEmailRequest" ADD CONSTRAINT "UserEmailRequest_user_form_submission_id_fkey" FOREIGN KEY ("user_form_submission_id") REFERENCES "user_form_submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
