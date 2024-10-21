'use client';

import React from 'react';
import { Home, Calendar, Gavel } from 'lucide-react';
import SubNavigationMenu from '@/components/molecules/SubNavigationMenu/SubNavigationMenu';

const newsLinks = [
  {
    name: 'Home',
    icon: Home,
    href: '/news',
  },
  {
    name: 'Announcements',
    icon: Calendar,
    href: '/news/announcements',
  },
  {
    name: 'Company',
    icon: Gavel,
    href: '/news/company',
  },
  {
    name: 'External',
    icon: Gavel,
    href: '/news/external',
  },
];

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <SubNavigationMenu title="News" links={newsLinks} rootPath="/news" />
      <div className="p-4">{children}</div>
    </div>
  );
}
