"use client";

import { Button } from "@material-tailwind/react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black mt-20 p-8 lg:p-16">
      <div className="text-2xl lg:text-4xl py-2">
        {`Looking for a new water heater, but don't know where to start?`}
      </div>
      <div className="text-lg lg:text-2xl py-2">
        Our simple questionnaire will recommend the right water heater for you
        in <span className="text-standard-green">2 minutes or less!</span>
      </div>
      <div className="flex text-sm lg:text-xl mt-4">
        <div>
          {`We provide personalized recommendations by accounting for the following factors:`}
          <ul className="list-disc ml-6 mt-2">
            <li className="py-1 lg:py-2 font-thin">Local energy bill costs</li>
            <li className="py-1 lg:py-2 font-thin">
              {`How much hot water you'll need`}
            </li>
            <li className="py-1 lg:py-2 font-thin">
              What fuel types you have available
            </li>
            <li className="py-1 lg:py-2 font-thin">
              How your current hot water heater is ventilated
            </li>
            <li className="py-1 lg:py-2 font-thin">
              The groundwater temperature in your area
            </li>
            <li className="py-1 lg:py-2 font-thin">
              Estimated water heater pricing
            </li>
            <li className="py-1 lg:py-2 font-thin">
              And any tax rebates that may be available
            </li>
          </ul>
          <Link href={`/appliance-finder`}>
            <Button
              placeholder="Get started"
              className={`cursor-pointer mt-6 w-48 h-16 text-standard-green bg-white font-light hover:bg-standard-green hover:text-white`}
            >
              Get Started
            </Button>
          </Link>
        </div>

        <div>{/* picture goes here */}</div>
      </div>
    </main>
  );
}
