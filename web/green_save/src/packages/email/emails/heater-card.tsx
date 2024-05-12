export const displayDollar = (valueInCents: number): string => {
  const dollars = valueInCents / 100;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(dollars);
};

export const RECOMMENDATION_TYPE = {
  BEST_VALUE_TODAY: 0,
  OUR_RECOMMENDATION: 1,
  ECO_FRIENDLY: 2,
};

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
  recommendationType: number;
  fuelType: string;
  heaterType: string;
  savingsRate: number;
}

export const HeaterCardEmail = ({
  energyStarPartner = "Rheem",
  modelName = "HPWH",
  modelNumber = "20222",
  costInCentsAfterCredits = 120000,
  annualSavingsInCents = 35000,
  upfrontCostInCents = 50000,
  recommendationType = 2,
  fuelType = "Natural Gas",
  heaterType = "Gas Tankless",
  savingsRate = 0.2,
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
        <Body className="font-sans my-auto mx-4 px-8 bg-white">
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
                and Tony{" "}
                <Link
                  href={`mailto:${"tony@trygreensave.com"}`}
                  className="text-blue-600 no-underline"
                >
                  {"(tony@trygreensave.com)"}
                </Link>{" "}
                from Green
                <span className="text-standard-green">$ave</span> following up
                with your water heater recommendation.
              </Text>
            </Column>
          </Section>
          <Container className="border rounded-md my-4 mx-auto p-[20px] shadow-md border-solid border-standard-green ">
            <Section>
              <Column align="center">
                <div className="text-xl text-black mb-4">{`${energyStarPartner} ${modelName} Water Heater`}</div>
                <div className="text-md text-gray-400 mb-4">
                  {`Model Number: ${modelNumber}`}
                </div>
                <div className="text-md text-gray-400 mb-4">
                  {`Runs on: ${fuelType}`}
                </div>
                <div className="text-lg text-black mb-4">{`Upfront Cost: ${displayDollar(upfrontCostInCents)}`}</div>
                <Reasons
                  recommendationType={recommendationType}
                  upfrontCostInCents={upfrontCostInCents}
                  costInCentsAfterCredits={costInCentsAfterCredits}
                  annualSavingsInCents={annualSavingsInCents}
                  heaterType={heaterType}
                  savingsRate={savingsRate}
                ></Reasons>
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
          <Section className="px-8 py-4 text-lg">
            <Column align="left">Best, Tyler + Tony</Column>
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

export const Reasons = ({
  recommendationType,
  upfrontCostInCents,
  costInCentsAfterCredits,
  annualSavingsInCents,
  heaterType,
  savingsRate,
}: {
  recommendationType: number;
  upfrontCostInCents: number;
  costInCentsAfterCredits: number;
  annualSavingsInCents: number;
  heaterType: string;
  savingsRate: number;
}) => {
  const taxCreditSavingsInCents = upfrontCostInCents - costInCentsAfterCredits;
  const tenYearSavingsInCents = annualSavingsInCents * 10;
  switch (recommendationType) {
    case RECOMMENDATION_TYPE.BEST_VALUE_TODAY:
      return (
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-lg">Eligible for federal tax credits</div>
            <div className="text-sm">
              Save over{" "}
              <span className="text-standard-green">
                {displayDollar(taxCreditSavingsInCents)}
              </span>{" "}
              upfront by using eligible tax credits
            </div>
          </div>
          <div>
            <div className="text-lg">Low installation costs </div>
            <div className="text-sm">
              No major changes needed to your heating system
            </div>
          </div>
        </div>
      );
    case RECOMMENDATION_TYPE.OUR_RECOMMENDATION:
      return (
        <div className="flex flex-col gap-2">
          <div>
            {tenYearSavingsInCents > 0 ? (
              <>
                <div className="text-lg">
                  This water heater will more than pay for itself
                </div>
                <div className="text-sm">
                  {`Over ten years, you'll save`}
                  <span className="text-standard-green">
                    {" "}
                    {displayDollar(tenYearSavingsInCents)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-lg">
                  This water heater is the least expensive long-term option
                </div>
                <div className="text-sm">{`All water heaters with your setup will cost you more in annual energy bills than is average for your location`}</div>
              </>
            )}
          </div>
          <div>
            {tenYearSavingsInCents > 0 ? (
              <>
                <div className="text-lg">Eligible for federal tax credits</div>
                <div className="text-sm">
                  Save over{" "}
                  <span className="text-standard-green">
                    {displayDollar(taxCreditSavingsInCents)}
                  </span>{" "}
                  upfront by using eligible tax credits
                </div>
              </>
            ) : (
              <>
                <div className="text-lg">
                  Consider choosing different fuel and ventilation options
                </div>
                <div className="text-sm">
                  {`Water heaters with options you've chosen will cause you to spend more money on energy bills over the long-term`}
                </div>
              </>
            )}
          </div>
          <div>
            <div className="text-lg">Low installation costs </div>
            <div className="text-sm">
              No major changes needed to your heating system
            </div>
          </div>
        </div>
      );
    case RECOMMENDATION_TYPE.ECO_FRIENDLY:
      return (
        <div className="flex flex-col gap-2">
          <div>
            <EcoFriendlyReason heaterType={heaterType} />
          </div>
          <div>
            <div className="text-lg">{`Lower your monthly energy bill`}</div>
            <div className="text-sm">{`Reduce your water heater energy spend by ${(savingsRate * 100).toFixed(2) + "%"}`}</div>
          </div>
          <div>
            <div className="text-lg">Eligible for federal tax credits</div>
            <div className="text-sm">
              Save over{" "}
              <span className="text-standard-green">
                {displayDollar(taxCreditSavingsInCents)}
              </span>{" "}
              upfront by using eligible tax credits
            </div>
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

const EcoFriendlyReason = ({ heaterType }: { heaterType: string }) => {
  if (
    heaterType === "Solar with Electric Backup" ||
    heaterType === "Solar with Gas Backup"
  ) {
    return (
      <>
        <div className="text-lg">{`Reduce your carbon footprint. `}</div>
        <div className="text-sm">{`This water heater uses solar energy to efficiently heat your water.`}</div>
      </>
    );
  } else if (heaterType === "Gas Tankless") {
    return (
      <>
        <div className="text-lg">{`Environmentally conscious water heater`}</div>
        <div className="text-sm">{` This tankless water heater only heats water on demand, meaning zero energy waste.`}</div>
      </>
    );
  } else if (heaterType === "Hybrid/Electric Heat Pump") {
    return (
      <>
        <div className="text-lg">{`Reduce your carbon footprint`}</div>
        <div className="text-sm">{`This water heater generates a percentage of its heat from the air around it, reducing your reliance on fossil fuels`}</div>
      </>
    );
  } else {
    return (
      <>
        <div className="text-lg">{`Reduce your carbon footprint`}</div>
        <div className="text-sm">{`Reduce your carbon footprint. This water heater generates a percentage of its heat from the air around it, reducing your reliance on fossil fuels`}</div>
      </>
    );
  }
};

export default HeaterCardEmail;
