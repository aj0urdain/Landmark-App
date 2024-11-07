'use client';

import * as React from 'react';
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
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export interface ComboboxOption {
  value: string;
  label: string | React.ReactNode;
  imageUrl?: string;
  disabled?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  placeholder: string;
  onSelect: (value: string) => void;
  selectedValue?: string;
  className?: string;
  avatar?: boolean;
  modal?: boolean;
}

export function Combobox({
  options,
  placeholder,
  onSelect,
  selectedValue,
  className,
  avatar = false,
  modal = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className="flex items-center gap-2">
            {avatar && (
              <Avatar className="border-muted border flex items-center w-5 h-5">
                <AvatarImage
                  src={
                    options.find((option) => option.value === selectedValue)?.imageUrl ??
                    ''
                  }
                  alt={
                    options.find((option) => option.value === selectedValue)
                      ?.label as string
                  }
                  className="h-full w-full object-cover"
                />
              </Avatar>
            )}
            {selectedValue
              ? options.find((option) => option.value === selectedValue)?.label
              : placeholder}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      if (!option.disabled) {
                        onSelect(currentValue === selectedValue ? '' : currentValue);
                        setOpen(false);
                      }
                    }}
                    disabled={option.disabled}
                    className={cn(option.disabled && 'cursor-not-allowed opacity-50')}
                  >
                    <div className="flex items-center gap-2">
                      {option.imageUrl &&
                        (avatar ? (
                          <Avatar className="border-muted border flex items-center w-5 h-5">
                            <AvatarImage
                              src={option.imageUrl}
                              alt={option.label as string}
                              className="h-full w-full object-cover"
                            />
                          </Avatar>
                        ) : (
                          <Image
                            src={option.imageUrl}
                            alt={option.label as string}
                            width={100}
                            height={100}
                            className="mr-2 h-5 w-5 object-contain"
                          />
                        ))}
                      <span>{option.label}</span>
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedValue === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
