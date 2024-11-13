import { useState, useEffect } from 'react';
import { IdCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { createBrowserClient } from '@/utils/supabase/client';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';

import Image from 'next/image';
import { Portal } from '@radix-ui/react-portal';

interface UserHoverCardProps {
  userId: string;
  children: React.ReactNode;
  visible?: boolean;
}

interface UserProfileComplete {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  business_number: string;
  profile_picture: string;
  created_at: string;
  departments: string[];
  roles: string[];
}

export function UserHoverCard({ userId, children, visible = true }: UserHoverCardProps) {
  const [user, setUser] = useState<UserProfileComplete | null>(null);
  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUser(data as unknown as UserProfileComplete);
      }
    };

    fetchUserProfile();
  }, [userId, supabase]);

  if (!user) {
    return <>{children}</>;
  }

  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/wiki/people/${user.first_name}-${user.last_name}`);
  };

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <Portal>
        <HoverCardContent
          className="z-[9999] w-80 animate-slide-up-fade-in overflow-y-visible p-0"
          align="start"
          side="top"
          sideOffset={15}
          hidden={!visible}
        >
          <div className="relative flex flex-col gap-2">
            <div className="flex w-full flex-col gap-2 p-4">
              <div className="flex gap-2">
                {user?.departments?.map((department: string) => {
                  if (department !== 'Burgess Rawson') {
                    return (
                      <DepartmentBadge
                        list
                        size="small"
                        key={department}
                        department={department}
                      />
                    );
                  }
                })}
              </div>
              <div className="flex w-2/3 flex-col gap-1">
                <Link
                  href={`/wiki/people/${user.first_name}-${user.last_name}`}
                  onClick={handleNameClick}
                  className="cursor-pointer text-lg font-light animated-underline-1 w-fit after:bottom-[1px]"
                >
                  {user.first_name} <span className="font-bold">{user.last_name}</span>
                </Link>
                {user?.roles?.map((role: string) => (
                  <Link
                    href={`/wiki/learn/roles/${role.toLowerCase().replace(/\s+/g, '-')}`}
                    key={role}
                    className="flex items-start justify-start gap-0.5 text-xs w-fit max-w-full text-muted-foreground animated-underline-1 after:bottom-[-1px]"
                  >
                    <IdCard className="min-w-4 h-4" />
                    <p className="truncate">{role}</p>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href={`/wiki/people/${user.first_name}-${user.last_name}`}
              onClick={handleNameClick}
              className="absolute bottom-0 right-0 w-1/3 cursor-pointer hover:animate-pulse hover:[animation-duration:_4s]"
            >
              {user?.profile_picture ? (
                <Image
                  src={user.profile_picture}
                  alt={user.first_name}
                  width={200}
                  height={200}
                  className="rounded-r-xl object-fill"
                />
              ) : (
                <div className="h-full w-full rounded-r-xl bg-muted" />
              )}
            </Link>
          </div>
        </HoverCardContent>
      </Portal>
    </HoverCard>
  );
}
