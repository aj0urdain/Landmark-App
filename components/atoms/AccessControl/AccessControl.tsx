import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userProfileOptions } from "@/types/userProfileTypes";
import React, { useEffect, useState } from "react";

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

export function AccessControl({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userProfile, isLoading } = useQuery(userProfileOptions);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading && userProfile) {
      const requiredAccess =
        routeAccess[pathname as keyof typeof routeAccess] || [];
      const userDepartments = userProfile?.departments || [];

      const access =
        requiredAccess.length === 0 ||
        userDepartments.some((dept: string) =>
          requiredAccess.includes(dept as string),
        );

      setHasAccess(access);

      if (!access) {
        router.replace("/access-denied");
      }
    }
  }, [userProfile, isLoading, router, pathname]);

  if (isLoading || hasAccess === null) {
    return <></>;
  }

  if (hasAccess === false) {
    return null;
  }

  return <>{children}</>;
}
