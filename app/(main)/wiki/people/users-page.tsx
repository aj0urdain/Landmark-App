'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { getAllUsers } from './_actions/getAllUsers';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import UserCard from '@/components/molecules/UserCard/UserCard';

// Filter by department
// Filter by branch

// hierarchy, national partners, state partners, senior leadership, agency (leasing) + cadets + admins + asset management teams

export function UsersPage() {
  const { data, isLoading, isError } = useQuery({
    ...getAllUsers,
    queryKey: [...getAllUsers.queryKey],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading user profile</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {data.map((user, index) => (
          <StaggeredAnimation key={String(user.id)} index={index}>
            <UserCard user={user} />
          </StaggeredAnimation>
        ))}
      </div>
    </div>
  );
}
