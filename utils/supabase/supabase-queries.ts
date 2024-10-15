import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "./client";

export interface Auction {
  id: string;
  start_date: string;
  auction_locations: { name: string };
  auction_venues: { name: string };
}

interface UserProfileEvent {
  id: string;
  first_name: string;
  last_name: string;
  birthday: string | null;
  work_anniversary: string | null;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  profile_picture: string | null;
}

const fetchUserProfileEvents = async () => {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("user_profile_complete")
    .select("id, first_name, last_name, birthday, work_anniversary")
    .not("birthday", "is", null)
    .not("work_anniversary", "is", null);

  if (error) throw error;
  return data as UserProfileEvent[];
};

export const useUserProfileEvents = () => {
  return useQuery({
    queryKey: ["userProfileEvents"],
    queryFn: fetchUserProfileEvents,
  });
};

export async function getUpcomingAuctions(limit?: number): Promise<Auction[]> {
  const supabase = createBrowserClient();
  const currentDate = new Date().toISOString();

  const { data, error } = await supabase
    .from("auctions")
    .select(
      `
      id,
      start_date,
      auction_locations(name),
      auction_venues(name)
    `,
    )
    .gte("start_date", currentDate)
    .order("start_date", { ascending: true })
    .limit(limit ?? 3);

  if (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }

  console.log(data);

  return data as unknown as Auction[];
}

export async function getProfileFromID(
  userId: string,
): Promise<UserProfile | null> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("user_profile_complete")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  console.log(`data from ${userId}`, data);

  return data as UserProfile;
}
