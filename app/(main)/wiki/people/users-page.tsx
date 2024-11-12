'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import Image from 'next/image';
import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import { Button } from '@/components/ui/button';
import { IdCard } from 'lucide-react';

import EmailContact from '@/components/atoms/EmailContact/EmailContact';
import PhoneContact from '@/components/atoms/PhoneContact/PhoneContact';
import { getAllUsers } from './_actions/getAllUsers';

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
        {data.map((user) => (
          <Card
            key={user.id}
            className="relative flex h-full min-h-[300px] flex-col items-start justify-between gap-4 p-4"
          >
            {user?.branches?.[0] && (
              <div className="absolute left-0 top-0 rounded-br-xl rounded-tl-xl bg-muted px-4 py-2 text-xl font-bold">
                <BranchBadge state={user?.branches?.[0]} list />
              </div>
            )}

            <div className="mt-10 flex w-full flex-col gap-4">
              <div className="flex gap-2">
                {user?.departments?.map((department: string) => {
                  if (department === 'Burgess Rawson') {
                    return null;
                  }

                  return (
                    <DepartmentBadge
                      list
                      size="small"
                      key={department}
                      department={department}
                    />
                  );
                })}
              </div>
              <div className="flex w-full flex-col gap-1">
                <p className="text-3xl font-bold">
                  {user.first_name} {user.last_name}
                </p>
                {user?.roles?.map((role: string) => (
                  <div
                    key={role}
                    className="flex w-fit items-center gap-2 font-semibold text-muted-foreground"
                  >
                    <IdCard className="h-5 w-5" />
                    {role}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {user.email && <EmailContact email={user.email} size="small" />}
                {user.business_number && (
                  <PhoneContact phoneNumber={user.business_number} size="small" />
                )}
              </div>
            </div>

            <div className="absolute bottom-0 right-0 top-0 w-2/5">
              {user?.profile_picture ? (
                <Image
                  src={user.profile_picture}
                  alt={user.first_name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-r-xl"
                />
              ) : (
                <div className="h-full w-full rounded-r-xl" />
              )}
            </div>

            <div className="w-2/5">
              <Link
                href={`/wiki/people/${user.first_name}-${user.last_name}`}
                key={user.id}
              >
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
