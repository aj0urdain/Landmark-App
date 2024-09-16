'use client';

import { DepartmentBadge } from '@/components/atoms/DepartmentBadge/DepartmentBadge';
import { Card } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string;
  roles: { role_name: string }[];
  departments: { department_name: string }[];
  branches: { branch_name: string }[];
}

export default function WelcomeCard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, profile_picture')
        .eq('id', user.id)
        .single();

      console.log(profileData); // need to couple data fetches with a function on supabase backend

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('roles(role_name)')
        .eq('user_id', user.id);

      console.log(rolesData);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      // Fetch user departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('user_departments')
        .select('departments(department_name)')
        .eq('user_id', user.id);

      console.log(departmentsData);

      if (departmentsError) {
        console.error('Error fetching user departments:', departmentsError);
        return;
      }

      // Fetch user branches
      const { data: branchesData, error: branchesError } = await supabase
        .from('user_branches')
        .select('branches(branch_name)')
        .eq('user_id', user.id);

      console.log(branchesData);

      if (branchesError) {
        console.error('Error fetching user branches:', branchesError);
        return;
      }

      const userProfile: UserProfile = {
        ...profileData,
        roles: rolesData?.map((r) => ({ role_name: r.roles.role_name })) || [],
        departments:
          departmentsData?.map((d) => ({
            department_name: d.departments.department_name,
          })) || [],
        branches:
          branchesData?.map((b) => ({ branch_name: b.branches.branch_name })) ||
          [],
      };

      console.log(userProfile);

      setUserProfile(userProfile);
    }

    fetchUserProfile();
  }, []);

  if (!userProfile)
    return (
      <Card className='w-full h-full overflow-visible relative p-6 animate-pulse' />
    );

  return (
    <Card className='w-full h-full overflow-visible relative p-6'>
      <div className='relative z-10 h-full w-full flex flex-col justify-between animate-slide-down-fade-in'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            {/* Rendering Department Badges */}
            {userProfile.departments?.map((dept, index) => (
              <DepartmentBadge key={index} department={dept.department_name} />
            ))}
          </div>
          <div>
            <h1 className='text-2xl font-bold'>
              Hello, {userProfile.first_name}!
            </h1>
            <p className='text-muted-foreground text-sm'>
              Have a great day at work today!
            </p>
          </div>
        </div>
        <div>
          <div className='relative z-10 h-full flex flex-col gap-1'>
            <p className='text-muted-foreground text-sm'>
              {userProfile.branches[0]?.branch_name || 'No Branch Assigned'}{' '}
              Branch
            </p>
            <p className='text-muted-foreground text-sm'>
              {userProfile.first_name} {userProfile.last_name}
            </p>
            <h3 className='text-base font-medium'>
              {userProfile.roles[0]?.role_name || 'No Role Assigned'}
            </h3>
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 right-0 w-1/2 h-[100%] overflow-visible animate-slide-down-fade-in z-20'>
        <Image
          src={
            userProfile.profile_picture || '/images/default-profile-picture.png'
          }
          alt={`${userProfile.first_name} ${userProfile.last_name}`}
          className='w-auto h-full object-cover opacity-100 overflow-y-visible'
          width={500}
          height={550}
        />
      </div>
    </Card>
  );
}
