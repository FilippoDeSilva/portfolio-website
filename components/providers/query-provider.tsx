"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          // Cache for 5 minutes by default
          staleTime: 5 * 60 * 1000,
          // Keep cached data for 10 minutes
          gcTime: 10 * 60 * 1000,
          // Don't refetch on window focus for better UX
          refetchOnWindowFocus: false,
          // Retry failed requests up to 1 time
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
