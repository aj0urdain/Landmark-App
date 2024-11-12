'use client';

import { NavLink } from '@/components/atoms/NavLink/NavLink';
import {
  Home,
  Newspaper,
  CheckSquare,
  Box,
  HousePlus,
  ShieldCheck,
  FileCode,
  BookText,
  LayoutDashboard,
  CalendarRange,
  WandSparkles,
  MessageCircle,
} from 'lucide-react';
import React from 'react';

import { Separator } from '@/components/ui/separator';

import { LibraryBig, Component, MapPin, Users, GraduationCap } from 'lucide-react';
import { FeedbackButton } from '@/components/molecules/Feedback/FeedbackButton/FeedbackButton';

interface NavigationProps {
  isCollapsed: boolean;
}

const links = [
  {
    href: '/admin',
    icon: ShieldCheck,
    label: 'Admin',
    access: ['Technology, Senior Leadership'],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  {
    href: '/create',
    icon: WandSparkles,
    label: 'Create',
    access: ['Technology'],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  {
    href: '/sandbox',
    icon: Box,
    label: 'Sandbox',
    access: ['Technology'],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  { type: 'separator' },

  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    access: [],
    comingSoon: false,
    requiredAccess: ['Technology'],
  },
  {
    href: '/events',
    icon: CalendarRange,
    label: 'Events',
    access: [],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  {
    href: '/tasks',
    icon: CheckSquare,
    label: 'Tasks',
    access: [],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  {
    href: '/news',
    icon: Newspaper,
    label: 'News',
    access: [],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  {
    href: '/chat',
    icon: MessageCircle,
    label: 'Chat',
    access: [],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  {
    href: '/properties',
    icon: HousePlus,
    label: 'Properties',
    access: [],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
  { type: 'separator' },

  {
    href: '/wiki',
    icon: BookText,
    label: 'Wiki',
    access: [],
    comingSoon: false,
    requiredAccess: [],
    subsections: [
      { name: 'Home', href: '/wiki', icon: Home },
      { name: 'Library', href: '/wiki/library', icon: LibraryBig },
      { name: 'Departments', href: '/wiki/departments', icon: Component },
      { name: 'Branches', href: '/wiki/branches', icon: MapPin },
      { name: 'People', href: '/wiki/people', icon: Users },
      { name: 'Learn', href: '/wiki/learn', icon: GraduationCap },
    ],
  },
  { type: 'separator' },
  {
    href: '/updates',
    icon: FileCode,
    label: ' Updates',
    access: [],
    comingSoon: true,
    requiredAccess: ['Technology'],
  },
];

export const Navigation = React.memo(function Navigation({
  isCollapsed,
}: NavigationProps) {
  return (
    <nav className="flex w-full flex-col gap-2 pt-4">
      {links.map((link, index: number) => {
        if (link.type === 'separator') {
          return <Separator key={`separator-${String(index)}`} className="my-4" />;
        }
        return (
          <NavLink
            key={link.href}
            href={link.href ?? ''}
            icon={link.icon ?? Home}
            isCollapsed={isCollapsed}
            comingSoon={link.comingSoon}
            subsections={link.subsections}
            requiredAccess={link.requiredAccess}
          >
            {link.label}
          </NavLink>
        );
      })}
      <Separator className="my-4" />
      <FeedbackButton isCollapsed={isCollapsed} />
    </nav>
  );
});
