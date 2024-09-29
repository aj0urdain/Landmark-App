"use server";

import { createServerClient } from "../server";

export const getUserProfileCompleteViaFullName = async (
  fullName: string | null,
) => {
  if (!fullName) {
    console.error("Error: fullName is null or undefined");
    return null;
  }

  const supabase = await createServerClient();

  const nameParts = fullName.split("-");
  if (nameParts.length !== 2) {
    console.error(
      "Error: Invalid fullName format. Expected 'firstName-lastName'",
    );
    return null;
  }

  const [firstName, lastName] = nameParts;

  const { data, error } = await supabase
    .from("user_profile_complete")
    .select("*")
    .ilike("first_name", `${firstName}`) // Case-insensitive match
    .ilike("last_name", `${lastName}`)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
};

export const getAllUserProfiles = async () => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("user_profile_complete")
    .select("*")
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Error fetching user profiles:", error);
    return null;
  }

  return data;
};
