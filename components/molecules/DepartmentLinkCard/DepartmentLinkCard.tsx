import { Card } from '@/components/ui/card';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { departmentInfo as departmentInfoArray } from '@/utils/getDepartmentInfo';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';

import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import { UserProfileCard } from '../UserProfileCard/UserProfileCard';
import { Dot } from '@/components/atoms/Dot/Dot';

import { debounce } from 'lodash';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';

const DepartmentLinkCard = ({
  department,
  departmentId,
  description,
}: {
  department: string;
  departmentId: number;
  description: string;
}) => {
  const supabase = createBrowserClient();
  const router = useRouter();
  const departmentInfo = departmentInfoArray.find((info) => info.name === department);

  const [hoveredDepartment, setHoveredDepartment] = useState<boolean>(false);

  if (!departmentInfo) return null;

  const { icon: Icon, border, textColor } = departmentInfo;

  const borderColor = border?.replace('border-', '');
  const textColorClass = textColor?.replace('text-', '');

  const debouncedSetHoveredDepartment = useCallback(
    debounce((state: boolean) => {
      setHoveredDepartment(state);
    }, 10),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetHoveredDepartment.cancel();
    };
  }, [debouncedSetHoveredDepartment]);

  const { data: users } = useQuery({
    queryKey: ['users', departmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .contains('department_ids', [departmentId]);

      if (error) {
        console.error(error);
        return [];
      }

      return data;
    },
  });

  // Get unique branch names from users
  const branchNames = useMemo(() => {
    if (!users) return [];
    const uniqueBranches = new Set(users.flatMap((user) => user.branches ?? []));
    return Array.from(uniqueBranches);
  }, [users]);

  // Get 3 random users for avatars, prioritizing those with profile pictures
  const randomUsers = useMemo(() => {
    if (!users) return [];

    // Separate users into two groups: with and without profile pictures
    const usersWithPictures = users.filter((user) => user.profile_picture);
    const usersWithoutPictures = users.filter((user) => !user.profile_picture);

    // Shuffle both arrays
    const shuffledWithPictures = [...usersWithPictures].sort(() => 0.5 - Math.random());
    const shuffledWithoutPictures = [...usersWithoutPictures].sort(
      () => 0.5 - Math.random(),
    );

    // Take up to 3 users, prioritizing those with pictures
    const selectedUsers = [
      ...shuffledWithPictures.slice(0, 3),
      ...shuffledWithoutPictures.slice(0, Math.max(0, 3 - shuffledWithPictures.length)),
    ].slice(0, 3);

    return selectedUsers;
  }, [users]);

  return (
    <Card
      key={department}
      className={cn(
        'transition-all p-6 flex flex-col justify-between h-60 cursor-pointer group overflow-visible',
        'hover:shadow-lg hover:-translate-y-1',
        'border-muted',
        borderColor ? `hover:border-${borderColor}` : '',
      )}
      onMouseEnter={() => debouncedSetHoveredDepartment(true)}
      onMouseLeave={() => debouncedSetHoveredDepartment(false)}
      onClick={() => {
        router.push(
          `/wiki/departments/${String(department).toLowerCase().replace(/\s+/g, '-')}`,
        );
      }}
    >
      <div className="flex flex-col gap-4 overflow-visible">
        <div className="flex items-center justify-between overflow-visible">
          <div
            className="flex gap-3 justify-start"
            key={branchNames.join('-')}
            onMouseEnter={() => debouncedSetHoveredDepartment(false)}
            onMouseLeave={() => debouncedSetHoveredDepartment(true)}
          >
            {branchNames.map((branch, index) => (
              <div
                className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity"
                key={branch}
              >
                <BranchBadge
                  key={branch}
                  branchName={branch}
                  list
                  colored={false}
                  size="small"
                />
                {index < branchNames.length - 1 && (
                  <Dot size="tiny" className="bg-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
          <div
            className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity"
            onMouseEnter={() => debouncedSetHoveredDepartment(false)}
            onMouseLeave={() => debouncedSetHoveredDepartment(true)}
          >
            <div className="flex -space-x-2 overflow-visible">
              {randomUsers.map((user, index) => (
                <StaggeredAnimation key={user.id} index={index}>
                  <UserProfileCard
                    key={user.id}
                    id={user.id ?? ''}
                    showAvatar={true}
                    avatarSize="small"
                    avatarOnly
                  />
                </StaggeredAnimation>
              ))}
            </div>
            {users && users.length > 3 && (
              <div className="flex items-center text-xs text-muted-foreground z-0">
                and {users.length - 3} others
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 overflow-visible"
        onMouseEnter={() => debouncedSetHoveredDepartment(true)}
      >
        <div className="flex items-center justify-between overflow-visible">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'transition-colors',
                'text-foreground',
                textColorClass ? `text-${textColorClass}` : '',
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <h1
              className={cn(
                'text-3xl font-bold transition-colors animated-underline-1',
                'text-muted-foreground',
                textColorClass ? `group-hover:text-${textColorClass}` : '',
                hoveredDepartment ? 'animated-underline-1-active' : '',
              )}
            >
              {department}
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors line-clamp-2 text-sm">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default DepartmentLinkCard;
