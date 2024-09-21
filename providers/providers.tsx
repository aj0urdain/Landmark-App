"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/utils/get-query-client";
import { createBrowserClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import type * as React from "react";

function RealtimeUpdates() {
  const queryClient = getQueryClient();
  const supabase = createBrowserClient();

  useEffect(() => {
    const subscription = supabase
      .channel("public:user_profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_profiles" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, supabase]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeUpdates />
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
