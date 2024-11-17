'use client';

import SubNavigationMenu from '@/components/molecules/SubNavigationMenu/SubNavigationMenu';
import { Home, LibraryBig, Component, MapPin, GraduationCap, Users } from 'lucide-react';

export const wikiLinks = [
  {
    name: 'Home',
    icon: Home,
    href: '/wiki',
  },
  {
    name: 'Library',
    icon: LibraryBig,
    href: '/wiki/library',
  },
  {
    name: 'Departments',
    icon: Component,
    href: '/wiki/departments',
    description: `Welcome to Burgess Rawson's Departments Overview. Here, you'll find a comprehensive guide to the teams driving our success in the commercial real estate industry. Each department plays a vital role in delivering seamless service, innovative solutions, and exceptional value to our clients. From managing multi-million-dollar properties to ensuring operational efficiency, these teams collaborate to uphold our reputation as a leader in commercial real estate across Australia. Explore each department to learn more about their responsibilities and how they contribute to Burgess Rawson's mission of excellence in the property market.`,
  },
  {
    name: 'Branches',
    icon: MapPin,
    href: '/wiki/branches',
  },
  {
    name: 'People',
    icon: Users,
    href: '/wiki/people',
  },
  {
    name: 'Learn',
    icon: GraduationCap,
    href: '/wiki/learn',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <SubNavigationMenu title="Wiki" links={wikiLinks} rootPath="/wiki" />
      {children}
    </div>
  );
}
