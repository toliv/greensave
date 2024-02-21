import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import Providers from "./providers";
import { TopBarNav } from "@/components/TopNavBar";

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
        <Providers>
          <TopBarNav></TopBarNav>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
