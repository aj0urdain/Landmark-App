import { selectUserProfileComplete } from "@/utils/use-cases/user-profile-page/user-profile";
import { queryOptions } from "@tanstack/react-query";
import { createServerClient } from "@/utils/supabase/server";

export const getUserProfilePage = queryOptions({
  queryKey: ["userProfilePage"],
  queryFn: async ({ queryKey }) => {
    const [_, name] = queryKey;
    if (typeof name !== "string") {
      throw new Error("Invalid name parameter");
    }
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(_, name, "_ and name");
    return await selectUserProfileComplete(name, user?.id);
  },
});
