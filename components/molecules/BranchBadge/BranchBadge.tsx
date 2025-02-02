'use client';

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
  size?: 'small' | 'medium' | 'large' | 'huge';
  colored?: boolean;
  showIcon?: boolean;
  className?: string;
}

const BranchBadge: React.FC<BranchBadgeProps> = ({
  branchName,
  list = false,
  size = 'medium',
  colored = true,
  showIcon = true,
  className,
}) => {
  const supabase = createBrowserClient();

  const {
    data: branchData,
    isLoading,
    isError,
  } = useQuery({
    enabled: !!branchName,
    queryKey: ['branch', branchName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('branch_name, states(short_name)')
        .eq('branch_name', branchName ?? '')
        .single();

      if (error) {
        console.error('Error fetching branch', error);
        return null;
      }

      return data;
    },
  });

  const stateInfo = branchData?.states?.short_name
    ? stateIcons[branchData.states.short_name.toUpperCase()]
    : null;

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
    huge: {
      button: 'p-0',
      icon: 'h-16 w-16',
      text: 'text-5xl font-bold',
    },
  };

  if (isLoading || isError || !branchData) {
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
          colored && stateInfo ? stateInfo.color : '',
          list ? 'h-auto' : 'bg-transparent',
          size === 'huge' ? 'gap-4' : '',
          'transition-colors',
          sizeClasses[size].button,
        )}
      >
        {showIcon && stateInfo && (
          <div className={cn('flex items-center justify-center', sizeClasses[size].icon)}>
            <stateInfo.icon className="h-full w-full" fill="currentColor" />
          </div>
        )}
        <span
          className={cn(
            'font-light animated-underline-1 after:bottom-[-2px]',
            sizeClasses[size].text,
            className,
          )}
        >
          {branchData.branch_name}
        </span>
      </Button>
    </Link>
  );
};

export default BranchBadge;
