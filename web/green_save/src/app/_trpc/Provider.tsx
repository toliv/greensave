"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";

import { trpc } from "./client";

export default function Provider({ children }: { children: React.ReactNode }) {
  if (typeof window !== "undefined") {
    console.log(window.location.origin);
  } else {
    console.log("WINDOW UNDEFINED :(* ");
  }

  const [queryClient] = useState(() => new QueryClient({}));
  // Use the environment variable if defined
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://greensave.vercel.app`
    : "http://localhost:3000";
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${baseUrl}/api/trpc`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
              mode: "no-cors",
            });
          },
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
