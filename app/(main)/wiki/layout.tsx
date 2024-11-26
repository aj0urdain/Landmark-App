import SubNavigationMenu from '@/components/molecules/SubNavigationMenu/SubNavigationMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wiki',
  description: 'View the Company Wiki and internal resources.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <SubNavigationMenu />
      {children}
    </div>
  );
}
