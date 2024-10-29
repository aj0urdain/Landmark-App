import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { IdCard } from 'lucide-react';
import { UserHoverCard } from '../LiveChat/UserHoverCard/UserHoverCard';

interface UserProfileCardProps {
  id: string;
  variant?: 'full' | 'compact' | 'minimal';
  showDepartments?: boolean;
  showName?: boolean;
  showRoles?: boolean;
  showAvatar?: boolean;
  className?: string;
  avatarSize?: 'small' | 'medium' | 'large';
  showHoverCard?: boolean;
}

export function UserProfileCard({
  id,
  variant = 'full',
  showDepartments = false,
  showName = false,
  showRoles = false,
  showAvatar = false,
  className = '',
  avatarSize = 'medium',
  showHoverCard = true,
}: UserProfileCardProps) {
  const supabase = createBrowserClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user profile</div>;
  if (!user) return null;

  return (
    <UserHoverCard userId={id} visible={showHoverCard}>
      <Card
        className={`overflow-visible group cursor-pointer ${className} ${
          variant == 'minimal' ? 'px-0 py-0 border-transparent' : ''
        }`}
      >
        <CardContent
          className={`${variant == 'minimal' ? 'px-0 py-0' : 'p-4'} border-none`}
        >
          <div className="flex items-end space-x-4">
            {showAvatar && (
              <Avatar
                className={`border border-muted bg-gradient-to-b transition-all from-transparent to-muted group-hover:border-muted-foreground/50 group-hover:to-muted-foreground/75 overflow-visible flex items-end justify-center ${
                  avatarSize === 'small'
                    ? 'w-8 h-8'
                    : avatarSize === 'large'
                      ? 'w-16 h-16'
                      : 'w-14 h-14'
                }`}
              >
                <AvatarImage
                  src={user.profile_picture ?? ''}
                  alt={`${user.first_name ?? ''} ${user.last_name ?? ''}`}
                  className="object-cover rounded-b-full w-auto h-[120%]"
                />
                <AvatarFallback>
                  {user.first_name?.[0] ?? ''}
                  {user.last_name?.[0] ?? ''}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="text-lg font-semibold">
                <span className="text-base font-light text-muted-foreground group-hover:text-foreground group-hover:underline transition-all">
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
                <DepartmentBadge key={department} department={department} size="small" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </UserHoverCard>
  );
}
