/*
  Warnings:

  - Added the required column `created_at` to the `user_form_submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_form_submission" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL;
