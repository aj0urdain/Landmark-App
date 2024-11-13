import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getDepartmentInfo } from '@/utils/getDepartmentInfo';
import { createBrowserClient } from '@/utils/supabase/client';

interface DepartmentBadgeProps {
  department: string | number | null | undefined;
  list?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  id?: boolean;
  showDepartmentName?: boolean;
}

const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({
  department,
  list = false,
  size = 'medium',
  className,
  id = false,
  showDepartmentName = true,
}) => {
  const [departmentName, setDepartmentName] = useState<string | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('departments')
          .select('department_name')
          .eq('id', department)
          .single();

        if (error) {
          console.error('Error fetching department name:', error);
        }

        if (data) {
          setDepartmentName(data.department_name);
        }
      }
    };

    if (id) {
      void fetchDepartmentName();
    } else {
      setDepartmentName(department as string);
    }
  }, [department, id]);

  const departmentInformation = getDepartmentInfo(departmentName);

  if (!departmentInformation || !departmentName) {
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
  };

  return (
    <Link href={`/wiki/departments/${link}`} passHref className="no-underline">
      <Button
        variant={list ? 'ghost' : 'outline'}
        size="sm"
        className={cn(
          'flex items-center gap-1 animated-underline-1 after:bottom-[-4px]',
          color,
          list ? 'h-auto p-0' : 'bg-transparent',
          'transition-colors',
          'p-0',
          className,
          `hover:text-${color} hover:bg-transparent`,
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
            {departmentName}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default DepartmentBadge;
