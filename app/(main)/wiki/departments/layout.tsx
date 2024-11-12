'use client';

import { GenericHeader } from '@/components/molecules/GenericHeader/GenericHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <GenericHeader
        title="Departments"
        description="Explore our company's various departments and their functions."
      />
      {children}
    </div>
  );
}
