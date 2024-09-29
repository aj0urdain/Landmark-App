import { getUserProfileCompleteViaFullName } from "@/utils/supabase/user-profile-page/user-profile-select";

export const selectUserProfileComplete = async (
  fullName: string,
  currentUserId: string | undefined,
) => {
  const userProfile = await getUserProfileCompleteViaFullName(fullName);

  if (!userProfile) {
    return null;
  }

  return {
    ...userProfile,
    canEdit: currentUserId === userProfile.id,
  };
};
