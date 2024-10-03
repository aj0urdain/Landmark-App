import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "@/utils/supabase/client";
import { userProfileOptions } from "@/types/userProfileTypes";

export function UserProfileManager() {
  const queryClient = useQueryClient();
  const supabase = createBrowserClient();

  const { data: userProfile } = useQuery({
    ...userProfileOptions,
    queryFn: async () => {
      const response = await fetch("/api/user-profile");
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  useEffect(() => {
    if (userProfile) {
      console.log("User profile updated:", userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        queryClient.invalidateQueries({
          queryKey: userProfileOptions.queryKey,
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  useEffect(() => {
    const channel = supabase
      .channel("public:user_profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_profiles" },
        () => {
          queryClient.invalidateQueries({
            queryKey: userProfileOptions.queryKey,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return null;
}
