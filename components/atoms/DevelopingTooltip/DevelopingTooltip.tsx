import { TooltipContent } from '@/components/ui/tooltip';
import { Cpu } from 'lucide-react';
import Link from 'next/link';

interface DevelopingTooltipProps {
  label: string;
}

export function DevelopingTooltip({ label }: DevelopingTooltipProps) {
  return (
    <TooltipContent
      side="top"
      align="center"
      sideOffset={10}
      className="flex cursor-pointer items-center gap-1 bg-muted text-xs text-blue-500 select-none z-[999]"
    >
      <Link href="/updates" className="flex items-center gap-1">
        <Cpu className="h-4 w-4 animate-pulse" />
        <p className="animated-underline-1">
          {label} is under construction by
          <span className="font-bold"> @Aaron!</span>
        </p>
      </Link>
    </TooltipContent>
  );
}
