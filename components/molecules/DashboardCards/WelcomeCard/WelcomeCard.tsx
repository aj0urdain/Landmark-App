'use client';

import { DepartmentBadge } from '@/components/atoms/DepartmentBadge/DepartmentBadge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useQueries } from '@tanstack/react-query';
import {
  userProfileOptions,
  userRolesOptions,
  userDepartmentsOptions,
  userBranchesOptions,
} from '@/utils/user-profile';

export default function WelcomeCard() {
  const results = useQueries({
    queries: [
      userProfileOptions,
      userRolesOptions,
      userDepartmentsOptions,
      userBranchesOptions,
    ],
  });

  const [profileResult, rolesResult, departmentsResult, branchesResult] =
    results;

  if (results.some((result) => result.isLoading)) {
    return (
      <Card className='w-full h-full overflow-visible relative p-6'>
        <div className='animate-pulse'>Loading...</div>
      </Card>
    );
  }

  if (results.some((result) => result.isError) || !profileResult.data) {
    return (
      <Card className='w-full h-full overflow-visible relative p-6'>
        <div>Error loading profile or no profile available</div>
      </Card>
    );
  }

  const userProfile = profileResult.data;
  const roles = rolesResult.data || [];
  const departments = departmentsResult.data || [];
  const branches = branchesResult.data || [];

  return (
    <Card className='w-full h-full overflow-visible relative p-6'>
      <div className='relative z-10 h-full w-full flex flex-col justify-between animate-slide-down-fade-in'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            {departments.map((dept, index) => (
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
              {branches[0]?.branch_name || 'No Branch Assigned'} Branch
            </p>
            <p className='text-muted-foreground text-sm'>
              {userProfile.first_name} {userProfile.last_name}
            </p>
            <h3 className='text-base font-medium'>
              {roles[0]?.role_name || 'No Role Assigned'}
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
