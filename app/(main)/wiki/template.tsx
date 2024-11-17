'use client';

import { usePathname } from 'next/navigation';
import { GenericHeader } from '@/components/molecules/GenericHeader/GenericHeader';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const isOneLevelDeep = segments.length === 2;

  return (
    <div className="flex flex-col">
      {isOneLevelDeep && <GenericHeader />}
      {children}
    </div>
  );
}
