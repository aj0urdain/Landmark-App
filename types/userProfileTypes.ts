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
  department_ids: number[] | null;
  roles: string[] | null;
  role_ids: number[] | null;
  branches: string[] | null;
  branch_ids: number[] | null;
  teams: string[] | null;
  team_ids: number[] | null;
}

export const userProfileOptions = {
  queryKey: ['userProfile'] as const,
  select: (data: unknown) => data as UserProfile,
};
