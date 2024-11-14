import { cn } from '@/lib/utils';

interface DotProps {
  size?: 'tiny' | 'small' | 'large';
  className?: string;
}

export function Dot({ size = 'small', className }: DotProps) {
  const sizeClass =
    size === 'tiny' ? 'h-0.5 w-0.5' : size === 'small' ? 'h-1 w-1' : 'h-2 w-2';
  return <div className={cn(`${sizeClass} rounded-full`, className)} />;
}
