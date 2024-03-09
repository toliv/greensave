"use client";
import { WaterHeater } from "@/app/api/utils/productData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@material-tailwind/react";
import { useState } from "react";

async function getProductById(id: string): Promise<WaterHeater | undefined> {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}

export default function Page({ params }: { params: { productId: string } }) {
  const queryClient = useQueryClient();
  const { data: waterHeater } = useQuery({
    queryKey: [`products/${params.productId}`],
    queryFn: () => getProductById(params.productId),
  });

  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [wantInstallation, setWantInstallation] = useState<boolean>(false);

  return (
    waterHeater && (
      <main className="min-h-screen bg-white text-black mt-20 p-8 lg:p-16">
        <div className="flex flex-col gap-8 items-start">
          <div className="flex flex-col gap-2 items-start">
            <div className="text-2xl">
              {waterHeater.brandName} {waterHeater.heaterType} Heater
            </div>
            <div className="text-sm text-default-gray">{`Model No. ${waterHeater.modelName}`}</div>
          </div>
          <div className="text-2xl">
            <div>{`$1399`}</div>
            <div className="text-lg text-default-gray">
              <s>{`$1699`}</s>
            </div>
          </div>
          <div className="text-lg">
            Quick facts
            <ul className="list-disc ml-6 mt-2">
              <li>{`Fueled by: ${waterHeater.fuelTypes.toString()}`}</li>
              {waterHeater.maximumGallonsPerMinute && (
                <li>{`${waterHeater.maximumGallonsPerMinute} gallons per minute`}</li>
              )}
            </ul>
          </div>

          <div className="text-black text-md">
            {`Why you'll love it:`}
            <ul className="list-disc ml-6 mt-2">
              <li>Comfortably serves your 2-shower household</li>
              <li>Comfortably serves your 2-shower household</li>
            </ul>
          </div>
          <div className="text-black text-lg">
            <div className="mb-2">
              Want to save this recommendation for later?
            </div>
            <div className="text-sm flex gap-4 items-center p-2">
              <Checkbox
                crossOrigin=""
                checked={sendEmail}
                onChange={() => setSendEmail(!sendEmail)}
                className="text-sm"
              />
              <div>Send me an email with this recommendation</div>
            </div>
            <div className="text-sm flex gap-4 items-center p-2">
              <Checkbox
                crossOrigin=""
                checked={wantInstallation}
                onChange={() => setWantInstallation(!wantInstallation)}
              />
              <div>
                I want Green$ave to contact me to help with purchase and
                installation
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  );
}
