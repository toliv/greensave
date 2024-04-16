import { displayDollar } from "@/app/utils/displayDollar";
import {
  Tailwind,
  Button,
  Html,
  Head,
  Body,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Column,
  Link,
} from "@react-email/components";

interface HeaterCardEmailProps {
  energyStarPartner: string;
  modelName: string;
  modelNumber: string;
  costInCentsAfterCredits: number;
  annualSavingsInCents: number;
  upfrontCostInCents: number;
}

export const HeaterCardEmail = ({
  energyStarPartner = "Rheem",
  modelName = "HPWH",
  modelNumber = "20222",
  costInCentsAfterCredits = 120000,
  annualSavingsInCents = 35000,
  upfrontCostInCents = 50000,
}: HeaterCardEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        {"Green$ave - Your water heater recommendation is ready!"}
      </Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                "standard-green": "#229943",
                "light-green": "#2EC745",
                "dark-green": "#1B7428",
              },
            },
          },
        }}
      >
        <Body className="font-sans my-auto mx-4 px-8">
          <Section>
            <Column align="left">
              <Text className="text-lg px-8">
                Hey! This is Tyler{" "}
                <Link
                  href={`mailto:${"tyler@trygreensave.com"}`}
                  className="text-blue-600 no-underline"
                >
                  {"(tyler@trygreensave.com)"}
                </Link>{" "}
                from Greensave following up with your water heater
                recommendation.
              </Text>
            </Column>
          </Section>
          <Container className="border rounded-md my-4 mx-auto p-[20px] shadow-md border-solid border-standard-green ">
            <Section>
              <Heading className="text-black text-3xl font-normal text-center p-0 my-[30px] mx-0">
                HEY
              </Heading>
              <Column align="center">
                <div className="text-xl text-black mb-4">{`${energyStarPartner} ${modelName} Water Heater`}</div>
                <div className="text-md text-gray-400 mb-4">
                  {`Model Number: ${modelNumber}`}
                </div>
                <div className="text-lg text-black mb-4">{`Upfront Cost: ${displayDollar(upfrontCostInCents)}`}</div>
                <div className="text-xl mb-4 text-standard-green">
                  {`${displayDollar(costInCentsAfterCredits)}`}
                  <span className="text-gray-400 ml-2 text-sm">{`with tax credits applied`}</span>
                </div>
                <div className="text-xl mb-4">
                  {`Save ${displayDollar(annualSavingsInCents)}`}
                  <span className="ml-2 text-sm">{`/ year`}</span>
                </div>
              </Column>
            </Section>
          </Container>
          <Section className="px-8 text-lg">
            <Column align="left">
              {`Don't hesitate to reach out to us with any questions you have
              either about picking the right water heater or handling purchase
              and installation.`}
            </Column>
          </Section>
          <Section className="px-8 py-4">
            <Column align="left">Best, Tyler</Column>
          </Section>
          <Section>
            <Column align="center">
              <Text className="text-2xl pt-4">
                Green
                <span className="text-standard-green">$ave</span>
              </Text>
            </Column>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default HeaterCardEmail;
