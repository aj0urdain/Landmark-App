import SubNavigationMenu from '@/components/molecules/SubNavigationMenu/SubNavigationMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'View upcoming events and activities.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <SubNavigationMenu />
      {children}
    </div>
  );
}
