import { queryOptions } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import {
  UserProfile,
  UserRole,
  UserDepartment,
  UserBranch,
} from '@/types/user-profile';

export const userProfileOptions = queryOptions({
  queryKey: ['userProfile'],
  queryFn: async (): Promise<UserProfile | null> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, profile_picture')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },
});

export const userRolesOptions = queryOptions({
  queryKey: ['userRoles'],
  queryFn: async (): Promise<UserRole[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('user_roles')
      .select('roles(role_name)')
      .eq('user_id', user.id);

    if (error) throw error;

    return data?.map((item) => ({ role_name: item.roles.role_name })) || [];
  },
});

export const userDepartmentsOptions = queryOptions({
  queryKey: ['userDepartments'],
  queryFn: async (): Promise<UserDepartment[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('user_departments')
      .select('departments(department_name)')
      .eq('user_id', user.id);

    if (error) throw error;
    return (
      data?.map((item) => ({
        department_name: item.departments.department_name,
      })) || []
    );
  },
});

export const userBranchesOptions = queryOptions({
  queryKey: ['userBranches'],
  queryFn: async (): Promise<UserBranch[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('user_branches')
      .select('branches(branch_name)')
      .eq('user_id', user.id);

    if (error) throw error;
    return (
      data?.map((item) => ({ branch_name: item.branches.branch_name })) || []
    );
  },
});
