export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

export interface UserRole {
  role_name: string;
}

export interface UserDepartment {
  department_name: string;
}

export interface UserBranch {
  branch_name: string;
}
