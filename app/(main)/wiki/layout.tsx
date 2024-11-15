'use client';

import { usePathname } from 'next/navigation';
import { GenericHeader } from '@/components/molecules/GenericHeader/GenericHeader';
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
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <SubNavigationMenu title="Wiki" links={wikiLinks} rootPath="/wiki" />
      {pathname !== '/wiki' && !pathname.startsWith('/wiki/people/') && <GenericHeader />}
      {children}
    </div>
  );
}
