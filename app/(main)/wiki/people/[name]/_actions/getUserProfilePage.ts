'use client';

import { selectUserProfileComplete } from '@/utils/use-cases/user-profile-page/user-profile';
import { queryOptions } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';

export const getUserProfilePage = queryOptions({
  queryKey: ['userProfilePage'],
  queryFn: async ({ queryKey }) => {
    const [_, name] = queryKey;
    if (typeof name !== 'string') {
      throw new Error('Invalid name parameter');
    }
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(_);
    return await selectUserProfileComplete(name, user?.id);
  },
});
