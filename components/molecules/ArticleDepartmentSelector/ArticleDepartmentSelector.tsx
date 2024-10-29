import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { departmentInfo } from '@/utils/getDepartmentInfo';
import { useQuery } from '@tanstack/react-query';

import { createBrowserClient } from '@/utils/supabase/client';

interface Department {
  id: number;
  department_name: string;
}

interface ArticleDepartmentSelectorProps {
  // Change to use IDs instead of names
  selectedDepartments: number[];
  onChange: (departments: number[]) => void;
}

export function ArticleDepartmentSelector({
  selectedDepartments = [], // This expects IDs
  onChange,
}: ArticleDepartmentSelectorProps) {
  const [open, setOpen] = useState(false);
  const supabase = createBrowserClient();

  const { data: departments = [], isLoading } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, department_name')
        .order('department_name');

      if (error) {
        console.error('Error fetching departments:', error);
        return [];
      }
      return data;
    },
  });

  // Combine database departments with departmentInfo metadata
  const enrichedDepartments = departments.map((dept) => ({
    ...dept,
    ...(departmentInfo.find((info) => info.name === dept.department_name) ?? {
      color: 'gray',
      backgroundColor: 'bg-gray-100',
    }),
  }));

  const toggleDepartment = (departmentId: number) => {
    const newSelection = selectedDepartments.includes(departmentId)
      ? selectedDepartments.filter((d) => d !== departmentId)
      : [...selectedDepartments, departmentId];
    onChange(newSelection);
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedDepartments?.length > 0
              ? `${selectedDepartments.length} departments`
              : 'Select departments...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search departments..." />
            <CommandList>
              <CommandEmpty>No department found.</CommandEmpty>
              <CommandGroup>
                {enrichedDepartments.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    onSelect={() => {
                      toggleDepartment(dept.id);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedDepartments.includes(dept.id)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {dept.department_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
