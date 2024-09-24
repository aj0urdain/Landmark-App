import { createBrowserClient } from "./client";

export interface Auction {
  id: number;
  date: string;
  auction_locations: {
    name: string;
  };
  auction_venues: {
    name: string;
  };
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  profile_picture: string | null;
}

export async function getUpcomingAuctions(limit?: number): Promise<Auction[]> {
  const supabase = createBrowserClient();
  const currentDate = new Date().toISOString();

  const { data, error } = await supabase
    .from("auctions")
    .select(
      `
      id,
      date,
      auction_locations(name),
      auction_venues(name)
    `,
    )
    .gte("date", currentDate)
    .order("date", { ascending: true })
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

  return data;
}
