'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import UserCard from '@/components/molecules/UserCard/UserCard';
import { createBrowserClient } from '@/utils/supabase/client';
import Error from 'next/error';

// Filter by department
// Filter by branch

// hierarchy, national partners, state partners, senior leadership, agency (leasing) + cadets + admins + asset management teams

export function UsersPage() {
  const supabase = createBrowserClient();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('id')
        .order('first_name', { ascending: true });

      if (error) {
        console.error(error);
      }

      return users;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !users) {
    return <div>Error loading user profile</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {users.map((user, index) => (
          <StaggeredAnimation key={String(user.id)} index={index}>
            <UserCard userId={user.id} />
          </StaggeredAnimation>
        ))}
      </div>
    </div>
  );
}
