'use client';

import React, { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import { Separator } from '@/components/ui/separator';
import { NavLink } from '@/components/atoms/NavLink/NavLink';
import { FeedbackButton } from '@/components/molecules/Feedback/FeedbackButton/FeedbackButton';
import { getIconFromString } from '@/utils/icons/icons';
import { useAccessibleRoutes } from '@/hooks/useAccessibleRoutes';

interface NavigationProps {
  isCollapsed: boolean;
}

export const Navigation = React.memo(function Navigation({
  isCollapsed,
}: NavigationProps) {
  const { accessibleRoutes, isLoading, getMainRoutes } = useAccessibleRoutes();
  const { data: userProfile } = useQuery(userProfileOptions);
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

  if (isLoading || !userProfile) return null;

  const mainRoutes = getMainRoutes?.();

  if (!mainRoutes) return null;

  return (
    <nav className="flex w-full flex-col gap-0 pt-4">
      {mainRoutes.map((route, index) => {
        if (!route.path) {
          return <Separator key={`separator-${String(route.id)}`} className="my-4" />;
        }

        const subsections = accessibleRoutes
          .filter((r) => r.parent_path === route.id)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        const Icon = getIconFromString(route.icon ?? '');

        return (
          <Fragment key={`navlink-${String(route.id)}-${String(index)}`}>
            <NavLink
              href={route.path}
              icon={Icon}
              routeId={route.id ?? ''}
              userId={userProfile.id}
              isCollapsed={isCollapsed}
              comingSoon={route.developing ?? true}
              isExpanded={activeSubsection === route.id}
              onExpand={() => {
                setActiveSubsection(activeSubsection === route.id ? null : route.id);
              }}
              subsections={
                subsections.length > 0
                  ? subsections.map((sub) => ({
                      name: sub.label ?? '',
                      href: sub.path ?? '',
                      icon: getIconFromString(sub.icon ?? ''),
                      comingSoon: sub.developing ?? true,
                      routeId: sub.id ?? '',
                      userId: userProfile.id,
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
