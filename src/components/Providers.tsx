"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  // Ensure QueryClient is created once per component lifecycle
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}