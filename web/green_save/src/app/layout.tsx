import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import Providers from "./providers";
import { TopBarNav } from "@/components/TopNavBar";
import Provider from "./_trpc/Provider";

export const metadata: Metadata = {
  title: "GreenSave",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={`relative`}>
        <Provider>
          <TopBarNav></TopBarNav>
          {children}
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
