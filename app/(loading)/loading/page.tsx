'use client';

import { LogoWordmark } from '@/components/atoms/LogoWordmark/LogoWordmark';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getQueryClient } from '@/utils/get-query-client';
import { signOutAction } from '@/app/actions';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        const queryClient = getQueryClient();
        queryClient.clear();
        await signOutAction();
        router.push('/sign-in');
      } catch (error) {
        console.error('Error during sign out:', error);
        // Fallback redirect in case of error
        router.push('/sign-in');
      }
    };

    void handleSignOut();
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="animate-pulse">
          <LogoWordmark className="w-48" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1 w-1 animate-pulse rounded-full bg-green-500" />
          <p>Signing out</p>
          <div className="h-1 w-1 animate-pulse rounded-full bg-green-500" />
        </div>
      </div>
    </div>
  );
}
