import React from 'react';
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
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDepartmentInfo } from '@/utils/getDepartmentInfo';

interface UserFilterProps {
  type: 'departments' | 'branches';
  options: string[];
  selectedOptions: string[] | string;
  onFilterChange: (selected: string[] | string) => void;
}

export function UserFilter({
  type,
  options,
  selectedOptions,
  onFilterChange,
}: UserFilterProps) {
  const handleSelect = (value: string) => {
    if (type === 'branches') {
      onFilterChange(value === selectedOptions ? '' : value);
    } else {
      const selected = selectedOptions as string[];
      const newSelected = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onFilterChange(newSelected);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between w-full">
          {type === 'branches'
            ? selectedOptions
              ? (selectedOptions as string)
              : `Select ${type}`
            : (selectedOptions as string[]).length > 0
              ? `${(selectedOptions as string[]).length} selected`
              : `Select ${type}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command>
          <CommandInput placeholder={`Search ${type}...`} />
          <CommandList>
            <CommandEmpty>No {type} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const departmentInfo =
                  type === 'departments' ? getDepartmentInfo(option) : null;
                const Icon = departmentInfo?.icon;

                return (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      handleSelect(option);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2">
                        {Icon && type === 'departments' && (
                          <Icon className={cn('h-4 w-4', departmentInfo.color)} />
                        )}
                        <span>{option}</span>
                      </div>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          type === 'branches'
                            ? selectedOptions === option
                              ? 'opacity-100'
                              : 'opacity-0'
                            : (selectedOptions as string[]).includes(option)
                              ? 'opacity-100'
                              : 'opacity-0',
                        )}
                      />
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
