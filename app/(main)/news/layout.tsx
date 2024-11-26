import SubNavigationMenu from '@/components/molecules/SubNavigationMenu/SubNavigationMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News',
  description: 'View the latest news and announcements.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <SubNavigationMenu />
      {children}
    </div>
  );
}
