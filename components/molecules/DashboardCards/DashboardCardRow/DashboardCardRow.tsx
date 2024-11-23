import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery/useMediaQuery';

interface DashboardCardRowProps {
  children: React.ReactNode;
  height?: number | string;
}

export function DashboardCardRow({ children, height = 420 }: DashboardCardRowProps) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const calculatedHeight =
    typeof height === 'number' ? `${isLargeScreen ? height : height * 2}px` : height;

  return (
    <div
      className={cn(
        'flex flex-col w-full animate-slide-down-fade-in gap-4 overflow-hidden h-full',
        'lg:h-auto lg:grid lg:grid-cols-12',
      )}
      style={{
        height: calculatedHeight,
      }}
    >
      {children}
    </div>
  );
}
