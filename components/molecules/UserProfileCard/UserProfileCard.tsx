import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { IdCard } from 'lucide-react';
import { UserHoverCard } from '../LiveChat/UserHoverCard/UserHoverCard';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useUser } from '@/queries/users/hooks';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  id: string;
  variant?: 'full' | 'compact' | 'minimal';
  showDepartments?: boolean;
  showName?: boolean;
  showRoles?: boolean;
  showAvatar?: boolean;
  className?: string;
  avatarSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showHoverCard?: boolean;
  nameOnly?: boolean;
  avatarOnly?: boolean;
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export function UserProfileCard({
  id,
  variant = 'full',
  showDepartments = false,
  showName = false,
  showRoles = false,
  showAvatar = false,
  className = '',
  avatarSize = 'md',
  showHoverCard = true,
  nameOnly = false,
  avatarOnly = false,
  textSize = 'base',
}: UserProfileCardProps) {
  const { data: user, isLoading, error } = useUser(id);

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const avatarSizes = {
    xxs: 'w-4 h-4',
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
    '2xl': 'w-16 h-16',
    '3xl': 'w-20 h-20',
    '4xl': 'w-24 h-24',
  };

  if (isLoading)
    return (
      <Skeleton className={`${avatarOnly ? 'w-8 h-8' : 'w-[100px]'} h-2.5 rounded-xl`} />
    );
  if (error) return <div>Error loading user profile</div>;
  if (!user) return null;

  if (avatarOnly) {
    return (
      <UserHoverCard userId={id} visible={showHoverCard}>
        <div className="group/user-profile-card relative">
          <div
            className={cn(
              `border border-muted rounded-full bg-gradient-to-b transition-all from-transparent to-muted group-hover/user-profile-card:border-muted-foreground/50 group-hover/user-profile-card:to-muted-foreground/75 overflow-visible flex items-end justify-center`,
              avatarSizes[avatarSize],
              className,
            )}
          >
            {user.profile_picture ? (
              <div className="relative bottom-0 rounded-full h-full w-full pt-4 bg-yellow-300">
                <Image
                  src={user.profile_picture}
                  alt={`${user.first_name} ${user.last_name}`}
                  fill
                  sizes="25px"
                  className="object-contain scale-150 rounded-b-full absolute pb-[5px]"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-xs font-semibold text-muted-foreground h-full w-full">
                {user.first_name[0]}
                {user.last_name[0]}
              </div>
            )}
          </div>
        </div>
      </UserHoverCard>
    );
  }

  return (
    <UserHoverCard userId={id} visible={showHoverCard}>
      {nameOnly ? (
        <Link href={`/wiki/people/${String(user.first_name)}-${String(user.last_name)}`}>
          <p
            className={cn(
              `text-${textSize} font-light animated-underline-1 ${className}`,
              textSizes[textSize],
            )}
          >
            {user.first_name} <span className="font-bold">{user.last_name}</span>
          </p>
        </Link>
      ) : (
        <Card
          className={`overflow-visible group cursor-pointer ${className} ${
            variant == 'minimal' ? 'px-0 py-0 border-transparent bg-transparent' : ''
          }`}
        >
          <CardContent
            className={`${variant == 'minimal' ? 'px-0 py-0' : 'p-4'} border-none`}
          >
            <div
              className={`flex items-end relative space-x-4 ${
                variant === 'minimal' && !showAvatar ? 'items-center' : ''
              }`}
            >
              {showAvatar && (
                <Avatar
                  className={cn(
                    `border border-muted bg-gradient-to-b transition-all from-transparent to-muted group-hover:border-muted-foreground/50 group-hover:to-muted-foreground/75 overflow-visible flex items-end justify-center`,
                    avatarSizes[avatarSize],
                  )}
                >
                  <AvatarImage
                    src={String(user.profile_picture)}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="absolute object-cover bottom-0 rounded-b-full w-auto h-[140%]"
                  />
                  <AvatarFallback>
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  <span
                    className={cn(
                      `font-light text-muted-foreground group-hover:text-foreground group-hover:animated-underline-1 transition-all ${
                        variant === 'minimal' && !showAvatar ? 'text-xs' : ''
                      }`,
                      textSizes[textSize],
                    )}
                  >
                    {showName && (
                      <>
                        {user.first_name}{' '}
                        <span className="font-bold">{user.last_name}</span>
                      </>
                    )}
                  </span>
                </h3>
                {showRoles && user.roles && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    {variant === 'compact' && <IdCard className="mr-1 h-4 w-4" />}
                    {user.roles.join(', ')}
                  </div>
                )}
              </div>
            </div>
            {showDepartments && user.departments && (
              <div className="mt-2 flex flex-wrap gap-1">
                {user.departments.map((department) => (
                  <DepartmentBadge
                    key={department}
                    department={department}
                    size="small"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </UserHoverCard>
  );
}
