'use client';

import { NavLink } from '@/components/atoms/NavLink/NavLink';
import {
  Home,
  Newspaper,
  CheckSquare,
  Mail,
  Box,
  LineChart,
  HousePlus,
  ShieldCheck,
} from 'lucide-react';

import React from 'react';

interface NavigationProps {
  isCollapsed: boolean;
}

const links = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/mailouts', icon: Mail, label: 'Mailouts' },
  { href: '/sandbox', icon: Box, label: 'Sandbox' },
  { href: '/analytics', icon: LineChart, label: 'Analytics' },
  { href: '/directory', icon: LineChart, label: 'Directory' },
  { href: '/listings', icon: HousePlus, label: 'Listings' },
  { href: '/admin', icon: ShieldCheck, label: 'Admin' },
];

export const Navigation = React.memo(function Navigation({
  isCollapsed,
}: NavigationProps) {
  return (
    <nav className='space-y-1 pt-4'>
      {links.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          icon={link.icon}
          isCollapsed={isCollapsed}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
});
