import { Settings, LogOut, Palette, Pyramid, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { signOutAction } from '@/app/actions';
import { getQueryClient } from '@/utils/get-query-client';
import { userProfileOptions } from '@/types/userProfileTypes';
import { useQuery } from '@tanstack/react-query';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Logo } from '@/components/atoms/Logo/Logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { LandmarkLogo } from '@/components/atoms/LandmarkLogo/LandmarkLogo';

export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (pathname !== '/settings') {
      setIsNavigating(false);
    }
  }, [pathname]);

  const { data: userProfile, isLoading, isError } = useQuery(userProfileOptions);

  const handleSignOut = () => {
    router.push('/loading');
  };

  const handleSettingsClick = () => {
    if (pathname === '/settings') return;
    setIsNavigating(true);
    router.push('/settings');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !userProfile) {
    return <div>Error loading user profile</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4">
          <Logo className="h-3.5 w-auto" />

          <div className="flex items-center justify-start gap-1">
            <p className="font-bold sm:font-light">{userProfile.first_name}</p>

            <p className="hidden font-bold sm:block">{userProfile.last_name}</p>
          </div>
          <Image
            src={userProfile.profile_picture ?? ''}
            alt="User Profile Picture"
            width={40}
            height={40}
            className="h-full w-auto"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{
          width: 'var(--radix-dropdown-menu-trigger-width)',
        }}
      >
        <DropdownMenuGroup>
          <div className="flex flex-col items-start p-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              <LandmarkLogo className="h-2.5 w-auto" />
              <p className="text-sm font-bold">Landmark</p>
            </div>
            <p className="text-[0.6rem]">v0.4.2</p>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleSettingsClick}
            disabled={isNavigating}
            className={cn(
              'relative',
              isNavigating &&
                pathname !== '/settings' &&
                'animate-pulse cursor-not-allowed',
            )}
          >
            {isNavigating && pathname !== '/settings' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Settings className="mr-2 h-4 w-4" />
            )}
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeToggle />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void handleSignOut();
          }}
        >
          <LogOut className="mr-2 h-4 w-4 text-destructive-foreground" />
          <span className="font-bold text-destructive-foreground">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
