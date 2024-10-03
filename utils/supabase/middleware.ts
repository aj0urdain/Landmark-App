import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define the required access for each route
const routeAccess = {
  "/admin": ["Technology"],
  "/create": ["Technology"],
  "/sandbox": ["Agency", "Technology", "Design", "Senior Leadership"],
  "/events": ["Technology"],
  "/tasks": ["Technology"],
  "/news": ["Technology"],
  "/wiki": [],
  "/properties": ["Technology"],
  "/updates": ["Technology"],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
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

  // If user is authenticated and trying to access the root or sign-in page, redirect to dashboard
  if (
    user &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/sign-in")
  ) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // If user is not authenticated and trying to access any page other than sign-in or auth routes, redirect to sign-in
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/sign-in") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    return NextResponse.redirect(signInUrl);
  }

  if (user) {
    const lastProfileFetch = request.cookies.get("lastProfileFetch")?.value;
    const now = Math.floor(Date.now() / 1000);

    if (!lastProfileFetch || now - parseInt(lastProfileFetch) > 300) {
      const { data: userProfile, error } = await supabase
        .from("user_profile_complete")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && userProfile) {
        supabaseResponse.cookies.set(
          "userProfile",
          JSON.stringify(userProfile),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 1 week
          },
        );

        supabaseResponse.cookies.set("lastProfileFetch", now.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60, // 1 week
        });
      }
    }

    // Check for required access
    const userProfile = JSON.parse(
      request.cookies.get("userProfile")?.value || "{}",
    );
    const userDepartments = userProfile.departments || [];
    const requiredAccess =
      routeAccess[request.nextUrl.pathname as keyof typeof routeAccess] || [];

    if (
      requiredAccess.length > 0 &&
      !userDepartments.some((dept: string) =>
        (requiredAccess as string[]).includes(dept),
      )
    ) {
      const accessDeniedUrl = request.nextUrl.clone();
      accessDeniedUrl.pathname = "/access-denied";
      return NextResponse.redirect(accessDeniedUrl);
    }
  }

  return supabaseResponse;
}
