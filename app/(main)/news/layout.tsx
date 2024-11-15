'use client';

import React from 'react';
import { Home, Speech, Building, Mailbox } from 'lucide-react';
import SubNavigationMenu from '@/components/molecules/SubNavigationMenu/SubNavigationMenu';

const newsLinks = [
  {
    name: 'Home',
    icon: Home,
    href: '/news',
  },
  {
    name: 'Announcements',
    icon: Speech,
    href: '/news/announcements',
  },
  {
    name: 'Company',
    icon: Building,
    href: '/news/company',
  },
  {
    name: 'External',
    icon: Mailbox,
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
