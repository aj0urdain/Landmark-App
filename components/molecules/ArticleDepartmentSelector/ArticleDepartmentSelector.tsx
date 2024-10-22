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
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { departmentInfo } from '@/utils/getDepartmentInfo';

interface ArticleDepartmentSelectorProps {
  selectedDepartments: string[];
  onChange: (departments: string[]) => void;
}

export function ArticleDepartmentSelector({
  selectedDepartments,
  onChange,
}: ArticleDepartmentSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleDepartment = (department: string) => {
    const newSelection = selectedDepartments.includes(department)
      ? selectedDepartments.filter((d) => d !== department)
      : [...selectedDepartments, department];
    onChange(newSelection);
  };

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
            Select departments...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search departments..." />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {departmentInfo.map((dept) => (
                <CommandItem key={dept.name} onSelect={() => toggleDepartment(dept.name)}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedDepartments.includes(dept.name)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {dept.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
