'use client';

import { usePathname } from 'next/navigation';

import { GenericDepartmentHeader } from '@/components/molecules/GenericDepartmentHeader/GenericDepartmentHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* {pathname !== '/wiki' &&
        !pathname.startsWith('/wiki/people/') &&
        !pathname.startsWith('/wiki/departments/') && <GenericDepartmentHeader />} */}
      <GenericDepartmentHeader />
      {children}
    </div>
  );
}
