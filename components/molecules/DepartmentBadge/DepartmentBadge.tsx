'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useDepartments } from '@/queries/departments/hooks';

interface DepartmentBadgeProps {
  department: string | number | null | undefined;
  list?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  showDepartmentName?: boolean;
  onAnimationEnd?: () => void;
}

const DepartmentBadge = ({
  department,
  list = false,
  size = 'medium',
  className,
  showDepartmentName = true,
  onAnimationEnd,
}: DepartmentBadgeProps) => {
  const { data: departments } = useDepartments();

  if (!department || !departments) return null;

  // Find the department from enriched data
  const enrichedDepartment = departments.find((dept) =>
    typeof department === 'string'
      ? dept.department_name.toLowerCase() === department.toLowerCase()
      : dept.id === department,
  );

  if (!enrichedDepartment) return null;

  const { department_name, icon: Icon, color, link } = enrichedDepartment;

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
    <Link href={`/wiki/departments/${String(link)}`} passHref className="no-underline">
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
          `hover:text-${String(color)} hover:bg-transparent`,
          size === 'small' ? 'after:bottom-[-1px]' : '',
        )}
      >
        <div className={cn('flex items-center justify-center', sizeClasses[size].icon)}>
          {Icon && <Icon className="h-full w-full" />}
        </div>
        {showDepartmentName && (
          <span
            className={cn(
              'font-medium no-underline hover:text-inherit',
              sizeClasses[size].text,
            )}
          >
            {department_name}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default DepartmentBadge;
