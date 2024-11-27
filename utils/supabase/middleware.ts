import { Database } from '@/types/supabaseTypes';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Skip permission checks for these paths
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/sign-in' ||
    request.nextUrl.pathname === '/access-denied' ||
    request.nextUrl.pathname === '/not-found' ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/loading')
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authentication redirects
  if (
    user &&
    (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/sign-in')
  ) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  if (!user) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = '/sign-in';
    return NextResponse.redirect(signInUrl);
  }

  try {
    const [{ data: routePermissions }, { data: userProfile }] = await Promise.all([
      supabase.from('route_permissions_complete').select('*'),
      supabase.from('user_profile_complete').select('*').eq('id', user.id).single(),
    ]);

    if (!routePermissions || !userProfile) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    const currentRoute = findClosestRoute(request.nextUrl.pathname, routePermissions);

    if (!currentRoute) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    if (currentRoute.developing) {
      const isTechnologyDepartment = userProfile.departments?.includes('Technology');

      if (!isTechnologyDepartment) {
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
    }

    if (currentRoute.public) {
      return supabaseResponse;
    }

    const routeWithInheritedAccess = getRouteWithInheritedAccess(
      currentRoute,
      routePermissions,
    );

    if (!routeWithInheritedAccess) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    const hasAccessControls =
      (routeWithInheritedAccess.department_ids?.length ?? 0) > 0 ||
      (routeWithInheritedAccess.team_ids?.length ?? 0) > 0 ||
      (routeWithInheritedAccess.role_ids?.length ?? 0) > 0 ||
      (routeWithInheritedAccess.user_ids?.length ?? 0) > 0;

    if (!hasAccessControls) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    const hasAccess =
      (routeWithInheritedAccess.department_ids?.some((id) =>
        userProfile.department_ids?.includes(id),
      ) ??
        false) ||
      (routeWithInheritedAccess.team_ids?.some((id) =>
        userProfile.team_ids?.includes(id),
      ) ??
        false) ||
      (routeWithInheritedAccess.role_ids?.some((id) =>
        userProfile.role_ids?.includes(id),
      ) ??
        false) ||
      (routeWithInheritedAccess.user_ids?.includes(userProfile.id ?? '') ?? false);

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    return supabaseResponse;
  } catch (error) {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }
}

const findClosestRoute = (pathname: string, routes: any[]) => {
  // Split the pathname into segments
  const pathSegments = pathname.split('/').filter(Boolean);

  // Try increasingly shorter paths until we find a match
  while (pathSegments.length > 0) {
    const testPath = '/' + pathSegments.join('/');
    const route = routes.find((r) => r.path === testPath);
    if (route) {
      console.log('🎯 Found closest matching route:', testPath);
      return route;
    }
    pathSegments.pop();
  }

  // If no match found, check if root path exists
  return routes.find((r) => r.path === '/');
};

const getRouteWithInheritedAccess = (route: any, routes: any[]) => {
  if (!route) return null;

  // Check if route has any access controls
  const hasAccessControls =
    (route.department_ids?.length ?? 0) > 0 ||
    (route.team_ids?.length ?? 0) > 0 ||
    (route.role_ids?.length ?? 0) > 0 ||
    (route.user_ids?.length ?? 0) > 0;

  // If route has access controls, return it as is
  if (hasAccessControls) {
    return route;
  }

  // If no access controls and has parent, inherit from parent
  if (route.parent_path) {
    const parentRoute = routes.find((r) => r.id === route.parent_path);
    return getRouteWithInheritedAccess(parentRoute, routes);
  }

  // If no parent and no access controls, return original route
  return route;
};
