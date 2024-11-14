import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VictoriaIcon } from '@/components/atoms/VictoriaIcon/VictoriaIcon';
import { NewSouthWalesIcon } from '@/components/atoms/NewSouthWalesIcon/NewSouthWalesIcon';
import { QueenslandIcon } from '@/components/atoms/QueenslandIcon/QueenslandIcon';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface StateInfo {
  name: string;
  icon: React.ComponentType<{ className?: string; fill?: string }>;
  color: string;
}

const stateIcons: Record<string, StateInfo> = {
  VIC: {
    name: 'Victoria',
    icon: VictoriaIcon,
    color: 'text-muted-foreground',
  },
  NSW: {
    name: 'New South Wales',
    icon: NewSouthWalesIcon,
    color: 'text-red-500 border-red-500',
  },
  QLD: {
    name: 'Queensland',
    icon: QueenslandIcon,
    color: 'text-yellow-500 border-yellow-500',
  },
};

interface BranchBadgeProps {
  branchName?: string;
  list?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  colored?: boolean;
}

const BranchBadge: React.FC<BranchBadgeProps> = ({
  branchName,
  list = false,
  onClick,
  size = 'medium',
  colored = true,
}) => {
  const supabase = createBrowserClient();

  const {
    data: branchData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['branch', branchName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('branch_name, states(short_name)')
        .eq('branch_name', branchName)
        .single();

      console.log(data);

      return data;
    },
  });

  const stateInfo = branchData?.states
    ? stateIcons[branchData.states.short_name.toUpperCase()]
    : null;

  if (!stateInfo) {
    return null;
  }

  const { icon: Icon, color } = stateInfo;

  const sizeClasses = {
    small: {
      button: 'p-0',
      icon: 'h-3 w-3',
      text: 'text-xs',
    },
    medium: {
      button: 'p-0',
      icon: 'h-4 w-4',
      text: 'text-sm',
    },
    large: {
      button: 'p-0',
      icon: 'h-5 w-5',
      text: 'text-lg',
    },
  };

  if (isLoading) {
    return null;
  }

  return (
    <Link
      href={`/wiki/branches/${String(branchName).toLowerCase()}`}
      passHref
      className="no-underline"
    >
      <Button
        variant={list ? 'ghost' : 'outline'}
        size="sm"
        className={cn(
          'm-0 flex items-center gap-1 p-0 text-muted-foreground hover:bg-transparent animate-slide-left-fade-in',
          colored ? color : '',
          list ? 'h-auto' : 'bg-transparent',
          'transition-colors',
          sizeClasses[size].button,
        )}
      >
        <div className={cn('flex items-center justify-center', sizeClasses[size].icon)}>
          <Icon className="h-full w-full" fill="currentColor" />
        </div>
        <span
          className={cn(
            'font-light animated-underline-1 after:bottom-[-2px]',
            sizeClasses[size].text,
          )}
        >
          {branchData?.branch_name}
        </span>
      </Button>
    </Link>
  );
};

export default BranchBadge;
