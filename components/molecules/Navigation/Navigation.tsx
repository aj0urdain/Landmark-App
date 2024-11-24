'use client';

import React, { Fragment } from 'react';
import { useRoutePermissions } from '@/queries/access/hooks';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import { Separator } from '@/components/ui/separator';
import { NavLink } from '@/components/atoms/NavLink/NavLink';
import { FeedbackButton } from '@/components/molecules/Feedback/FeedbackButton/FeedbackButton';
import { getIconFromString } from '@/utils/icons/icons';
import { useUser } from '@/queries/users/hooks';

interface NavigationProps {
  isCollapsed: boolean;
}

export const Navigation = React.memo(function Navigation({
  isCollapsed,
}: NavigationProps) {
  const { data: routePermissions, isLoading } = useRoutePermissions();
  const { data: userProfile } = useQuery(userProfileOptions);
  const { data: user } = useUser(userProfile?.id ?? '');

  if (isLoading || !routePermissions || !userProfile || !user) return null;

  const mainRoutes = routePermissions
    .filter((route) => route.visible && !route.parent_path)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <nav className="flex w-full flex-col gap-2 pt-4">
      {mainRoutes.map((route, index) => {
        if (!route.path) {
          return <Separator key={`separator-${route.id}`} className="my-4" />;
        }

        const subsections = routePermissions
          .filter((r) => r.parent_path === route.id)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        const Icon = getIconFromString(route.icon ?? '');

        return (
          <Fragment key={`navlink-${route.id}-${index}`}>
            <NavLink
              href={route.path}
              icon={Icon}
              routeId={route.id}
              userId={user.id}
              isCollapsed={isCollapsed}
              comingSoon={route.developing ?? false}
              subsections={
                subsections.length > 0
                  ? subsections.map((sub) => ({
                      name: sub.label,
                      href: sub.path,
                      icon: getIconFromString(sub.icon ?? ''),
                      comingSoon: sub.developing ?? false,
                      routeId: sub.id,
                      userId: user.id,
                    }))
                  : undefined
              }
            >
              {route.label}
            </NavLink>
            {(route.path === '/wiki' || route.path === '/admin') && (
              <Separator className="my-4" />
            )}
          </Fragment>
        );
      })}
      <FeedbackButton isCollapsed={isCollapsed} />
    </nav>
  );
});
