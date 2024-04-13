import { Resend } from "resend";
import { HeaterEmailCard } from "@/components/EmailTemplate";
import { HeaterRecommendationType } from "@/schema/heaterRecommendations";

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
    subject: "[Green$ave] Your New Water Heater",
    react: HeaterEmailCard({ heater: selectedHeater }) as React.ReactElement,
  });
};
