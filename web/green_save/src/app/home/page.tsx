"use client";

import { Button } from "@material-tailwind/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black mt-20 p-8 lg:p-16">
      <div className="text-2xl lg:text-4xl py-2">
        Looking for a new water heater, but don't know where to start?
      </div>
      <div className="text-lg lg:text-2xl py-2">
        Our simple questionnaire will recommend the right water heater for you
        in 2 minutes or less.
      </div>
      <div className="text-md lg:text-2xl py-6 min-w-[200px]">
        <Button
          placeholder="Get started"
          className={`w-32 h-12 text-standard-green bg-white font-light hover:bg-standard-green hover:text-white`}
        >
          Get Started
        </Button>
      </div>
      <div className="flex text-sm lg:text-xl mt-4">
        <div>
          We'll help you take into account for the following factors:
          <ul className="list-disc ml-6 mt-2">
            <li className="py-1 lg:py-2 font-thin">
              How much hot water you'll need at any given time
            </li>
            <li className="py-1 lg:py-2 font-thin">
              What fuel types you already use
            </li>
            <li className="py-1 lg:py-2 font-thin">
              How your hot water heater already ventilates and the power outlets
              it uses
            </li>
            <li className="py-1 lg:py-2 font-thin">
              Local considerations like climate and energy costs
            </li>
            <li className="py-1 lg:py-2 font-thin">
              And any tax rebates that may be available to you
            </li>
          </ul>
          <Button
            placeholder="Get started"
            className={`mt-6 w-32 h-12 text-standard-green bg-white font-light hover:bg-standard-green hover:text-white`}
          >
            Get Started
          </Button>
        </div>

        <div>{/* picture goes here */}</div>
      </div>
    </main>
  );
}
