import React, { useCallback, useState } from 'react';

import { Card } from '@/components/ui/card';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';
import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { IdCard } from 'lucide-react';
import EmailContact from '@/components/atoms/EmailContact/EmailContact';
import PhoneContact from '@/components/atoms/PhoneContact/PhoneContact';
import { cn } from '@/lib/utils';

const UserCard = ({ user }: { user: User }) => {
  const [hoveredUserId, setHoveredUserId] = useState<boolean>(false);

  const debouncedSetHoveredUserId = useCallback(
    debounce((state: boolean) => {
      setHoveredUserId(state);
    }, 10),
    [],
  );

  React.useEffect(() => {
    return () => {
      debouncedSetHoveredUserId.cancel();
    };
  }, [debouncedSetHoveredUserId]);

  return (
    <Card
      key={user.id}
      className="relative flex h-full min-h-[300px] flex-col items-start justify-between gap-4 p-6 w-full group transition-all duration-300 overflow-hidden"
    >
      <div className="absolute left-0 top-0 z-10 flex h-full transition-all duration-300 w-full flex-col items-start justify-between bg-gradient-to-br from-muted/50 to-transparent p-0" />
      <div className="group-hover:flex hidden group-hover:opacity-100 opacity-0 absolute left-0 top-0 z-10 h-full animate-slide-up-fade-in group-hover:animate-pulse transition-all duration-300 w-full flex-col items-start justify-between bg-gradient-to-br from-muted/75 to-transparent p-0 animation-fill-forwards group-hover:animation-fill-forwards group-hover:animation-delay-1000" />

      {user?.branches?.[0] && (
        <div className="absolute left-0 top-0 z-20 rounded-br-xl rounded-tl-xl bg-muted/25 px-4 py-2 text-xl font-bold">
          <BranchBadge
            branchName={user?.branches?.[0]}
            list
            size="small"
            colored={false}
          />
        </div>
      )}
      <div className="relative h-full w-full z-20 flex flex-col justify-between">
        <div className="mt-6 flex w-full flex-col gap-6">
          <div className="flex flex-col gap-3">
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
            <div className="flex w-fit flex-col gap-1">
              <Link
                href={`/wiki/people/${String(user.first_name)}-${String(user.last_name)}`}
                key={String(user.id)}
                onMouseEnter={() => debouncedSetHoveredUserId(true)}
                onMouseLeave={() => debouncedSetHoveredUserId(false)}
              >
                <p
                  className={`text-3xl w-fit font-light relative animated-underline-1 ${
                    hoveredUserId ? 'animated-underline-1-active' : ''
                  }`}
                >
                  {user.first_name} <span className="font-bold">{user.last_name}</span>
                </p>
              </Link>
              {user?.roles?.map((role: string) => (
                <Link href={`/wiki/learn/roles/${role.split(' ').join('-')}`} key={role}>
                  <div
                    key={role}
                    className="flex max-w-60 w-fit items-start gap-1.5 font-semibold  text-muted-foreground"
                  >
                    <IdCard
                      className={`w-full ${
                        role.length > 20 ? 'min-w-4 max-w-4 pb-1' : 'min-w-5 max-w-5'
                      }`}
                    />
                    <p
                      className={cn(
                        role.length > 20 ? 'text-sm' : '',
                        'animated-underline-1 after:bottom-[1px] w-fit',
                      )}
                    >
                      {role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-muted-foreground/50">
            {user.email && <EmailContact email={user.email} size="small" />}
            {user.business_number && (
              <PhoneContact phoneNumber={user.business_number} size="small" />
            )}
          </div>
        </div>

        <div className="w-2/5">
          <Link
            href={`/wiki/people/${user.first_name}-${user.last_name}`}
            key={user.id}
            onMouseEnter={() => debouncedSetHoveredUserId(true)}
            onMouseLeave={() => debouncedSetHoveredUserId(false)}
          >
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 right-2 top-0 w-2/5 z-20">
        {user?.profile_picture ? (
          <Link
            href={`/wiki/people/${user.first_name}-${user.last_name}`}
            key={user.id}
            onMouseEnter={() => debouncedSetHoveredUserId(true)}
            onMouseLeave={() => debouncedSetHoveredUserId(false)}
          >
            <Image
              src={user.profile_picture}
              alt={user.first_name}
              layout="fill"
              objectFit="cover"
              className="rounded-r-xl transition-all duration-500 group-hover:drop-shadow-[-75px_-100px_200px_rgba(255,255,255,0.35)] animate-slide-up-fade-in animation-delay-1000 animation-fill-forwards"
            />
          </Link>
        ) : (
          <div className="h-full w-full rounded-r-xl" />
        )}
      </div>
    </Card>
  );
};

export default UserCard;
