import { createBrowserClient } from '@/utils/supabase/client';

export const accessApi = {
  getRoutePermissions: async () => {
    const supabase = createBrowserClient();

    // Get all routes with their basic info
    const { data: routes, error: routesError } = await supabase
      .from('route_permissions')
      .select('*')
      .order('sort_order');

    if (routesError) throw new Error(routesError.message);

    return routes;
  },

  checkRouteAccess: async (routeId: string, userId: string) => {
    const supabase = createBrowserClient();

    // Get user's profile with all their access info
    const { data: userProfile, error: userError } = await supabase
      .from('user_profile_complete')
      .select('department_ids, team_ids, role_ids')
      .eq('id', userId)
      .single();

    if (userError) throw new Error(userError.message);

    if (!userProfile.department_ids || !userProfile.team_ids || !userProfile.role_ids) {
      return false;
    }

    // Check if user has access through any means
    const { data: access, error: accessError } = await supabase
      .from('route_access')
      .select('*')
      .eq('route_id', routeId)
      .or(
        `user_id.eq.${userId},department_id.in.(${userProfile.department_ids.join(',')}),team_id.in.(${userProfile.team_ids.join(',')}),role_id.in.(${userProfile.role_ids.join(',')})`,
      );

    if (accessError) throw new Error(accessError.message);

    // If no access records exist, everyone can access
    // If access records exist, user needs to match at least one rule
    return access.length === 0 || access.length > 0;
  },
};
