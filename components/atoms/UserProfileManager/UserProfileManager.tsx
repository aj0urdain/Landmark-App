import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "@/utils/supabase/client";
import { userProfileOptions } from "@/types/userProfileTypes";

export function UserProfileManager() {
  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {} = useQuery({
    ...userProfileOptions,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);
      if (!user) {
        setIsAuthenticated(false);
        queryClient.clear();
        return null;
      }

      console.log(`we're about to fetch the user profile for ${user.id}`);
      const { data, error } = await supabase
        .from("user_profile_complete")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw new Error("Failed to fetch user profile");
      console.log(`we've got the user profile for ${user.id}, ${data}`);

      return data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchInterval: isAuthenticated ? 5 * 60 * 1000 : false,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (event === "SIGNED_IN") {
          queryClient.invalidateQueries({
            queryKey: userProfileOptions.queryKey,
          });
        } else if (event === "SIGNED_OUT") {
          queryClient.clear();
          localStorage.clear();
          sessionStorage.clear();
          queryClient.invalidateQueries();
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [supabase, queryClient, isAuthenticated]);

  return null;
}
