export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  first_name: string;
  last_name: string;
  birthday: string | null;
  business_number: string | null;
  mobile_number: string | null;
  work_anniversary: string | null;
  profile_picture: string | null;
  departments: string[] | null;
  roles: string[] | null;
  branches: string[] | null;
}

export const userProfileOptions = {
  queryKey: ["userProfile"] as const,
  select: (data: unknown) => data as UserProfile,
};
