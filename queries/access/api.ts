import { createBrowserClient } from '@/utils/supabase/client';

export const accessApi = {
  getRoutePermissions: async () => {
    const supabase = createBrowserClient();

    // Get all routes with their basic info
    const { data: routes, error: routesError } = await supabase
      .from('route_permissions_complete')
      .select('*')
      .order('sort_order');

    if (routesError) throw new Error(routesError.message);

    return routes;
  },

  getRouteAccess: async () => {
    const supabase = createBrowserClient();

    // Check if user has access through any means
    const { data: access, error: accessError } = await supabase
      .from('route_access')
      .select('*');

    if (accessError) throw new Error(accessError.message);

    return access;
  },
};

export const authApi = {
  getAllowedDomains: async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'ALLOWED_DOMAINS')
      .single();

    if (error) {
      console.error('Error fetching allowed domains:', error);
      throw new Error(error.message);
    }

    return data.value as string[];
  },
};
