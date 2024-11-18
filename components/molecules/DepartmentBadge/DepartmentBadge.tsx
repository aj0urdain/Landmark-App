'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getDepartmentInfo } from '@/utils/getDepartmentInfo';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface DepartmentBadgeProps {
  department: string | number | null | undefined;
  list?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  id?: boolean;
  showDepartmentName?: boolean;
  onAnimationEnd?: () => void;
}

const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({
  department,
  list = false,
  size = 'medium',
  className,
  id = false,
  showDepartmentName = true,
  onAnimationEnd,
}) => {
  const supabase = createBrowserClient();

  // if department is given as an id, fetch the department name
  const { data: departmentDataID } = useQuery({
    enabled: id && typeof department === 'number',
    queryKey: ['departmentID', department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, department_name')
        .eq('id', department as string)
        .single();

      if (error) {
        console.error('Error fetching department:', error);
        return null;
      }

      return data;
    },
  });

  const { data: departmentDataName } = useQuery({
    enabled: !id && typeof department === 'string',
    queryKey: ['department', department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, department_name')
        .eq('department_name', department as string)
        .single();

      if (error) {
        console.error('Error fetching department:', error);
        return null;
      }

      return data;
    },
  });

  const departmentData = departmentDataID ?? departmentDataName;

  const departmentInformation = getDepartmentInfo(departmentData?.department_name);

  if (!departmentInformation || !departmentData?.department_name) {
    return null;
  }

  const { icon: Icon, color, link } = departmentInformation;

  const sizeClasses = {
    small: {
      button: 'px-2 py-1',
      icon: 'h-3 w-3',
      text: 'text-xs',
    },
    medium: {
      button: 'px-3 py-1',
      icon: 'h-4 w-4',
      text: 'text-sm',
    },
    large: {
      button: 'px-4 py-2',
      icon: 'h-5 w-5',
      text: 'text-base',
    },
    xlarge: {
      button: 'px-4 py-2',
      icon: 'h-6 w-6',
      text: 'text-lg',
    },
  };

  return (
    <Link href={`/wiki/departments/${link}`} passHref className="no-underline">
      <Button
        variant={list ? 'ghost' : 'outline'}
        size="sm"
        onAnimationEnd={onAnimationEnd}
        className={cn(
          'flex items-center gap-1 animated-underline-1 after:bottom-[-4px]',
          color,
          list ? 'h-auto p-0' : 'bg-transparent',
          'transition-colors',
          'p-0',
          className,
          `hover:text-${color} hover:bg-transparent`,
          size === 'small' ? 'after:bottom-[-1px]' : '',
        )}
      >
        <div className={cn('flex items-center justify-center', sizeClasses[size].icon)}>
          <Icon className="h-full w-full" />
        </div>
        {showDepartmentName && (
          <span
            className={cn(
              'font-medium no-underline hover:text-inherit',
              sizeClasses[size].text,
            )}
          >
            {departmentData.department_name}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default DepartmentBadge;
