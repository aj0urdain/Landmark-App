import { createServerClient } from '@/utils/supabase/server';
import React from 'react';

async function DashboardPage() {
  const {
    data: { user },
  } = await createServerClient().auth.getUser();

  return <div>Hey {user?.email}</div>;
}

export default DashboardPage;
