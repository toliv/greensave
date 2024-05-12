"use client";

import { TopBarNav } from "@/components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import Provider from "./_trpc/Provider";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={`relative`}>
        <Provider>
          <TopBarNav></TopBarNav>
          <main className="min-h-screen bg-white text-black mt-20 p-8 lg:p-16">
            <div className="flex flex-col justify-center">
              <div className="text-2xl lg:text-4xl py-2">
                {`Oops, something went wrong!`}
              </div>
              <div className="text-lg lg:text-xl text-gray-400 py-2">
                {`Feel free to email us at info@trygreensave.com and we'll be happy to help troubleshoot!`}
              </div>
              <div className="flex">
                <Link href="/home">
                  <div className="text-lg lg:text-xl py-2 ">
                    <div className="border border-gray-400 shadow-md bg-light-green text-white p-2 lg:p-4 rounded-md">
                      Click here to return to the home page
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </main>
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
