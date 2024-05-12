import { Resend } from "resend";
import { HeaterRecommendationType } from "@/schema/heaterRecommendations";
import HeaterCardEmail from "@/packages/email/emails/heater-card";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailToUser = async ({
  userEmail,
  selectedHeater,
}: {
  userEmail: string;
  selectedHeater: HeaterRecommendationType;
}) => {
  return await resend.emails.send({
    from: "Green$ave <info@trygreensave.com>",
    to: [userEmail],
    cc: ["tony@trygreensave.com, tyler@trygreensave.com"],
    subject: "[Green$ave] Your New Water Heater",
    react: HeaterCardEmail({
      energyStarPartner: selectedHeater.energyStarPartner,
      modelName: selectedHeater.modelName,
      modelNumber: selectedHeater.modelNumber,
      costInCentsAfterCredits: selectedHeater.costInCentsAfterCredits,
      annualSavingsInCents: selectedHeater.annualSavingsInCents,
      upfrontCostInCents: selectedHeater.upfrontCostInCents,
    }) as React.ReactElement,
  });
};
