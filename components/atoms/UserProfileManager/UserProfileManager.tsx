import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "@/utils/supabase/client";
import { userProfileOptions } from "@/types/userProfileTypes";

export function UserProfileManager() {
  const queryClient = useQueryClient();
  const supabase = createBrowserClient();

  useQuery({
    ...userProfileOptions,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_profile_complete")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("public:user_profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_profiles" },
        (payload) => {
          console.log(`payload:`, payload);
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
