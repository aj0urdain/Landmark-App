import { getAllUserProfiles } from "@/utils/supabase/user-profile-page/user-profile-select";

export const selectAllUsers = async () => {
  const userProfiles = await getAllUserProfiles();

  if (!userProfiles) {
    return null;
  }

  return userProfiles;
};
