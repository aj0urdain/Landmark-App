import React, { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getEventTypeInfo } from "@/utils/eventTypeInfo";

export interface Option {
  value: string;
  label: string;
  section: "portfolio" | "personal" | "additional";
}

interface MultiSelectComboboxProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
}

export function MultiSelectCombobox({
  options,
  selectedValues,
  onChange,
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const portfolioOptions = options.filter(
    (option) => option.section === "portfolio",
  );
  const personalOptions = options.filter(
    (option) => option.section === "personal",
  );
  const additionalOptions = options.filter(
    (option) => option.section === "additional",
  );

  const allSelected = selectedValues.length === options.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {allSelected
            ? "No filters selected"
            : selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : "Select event types..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search event types..." className="h-9" />
          <CommandList>
            <CommandEmpty>No event types found.</CommandEmpty>
            <CommandGroup heading="Portfolio Events">
              {portfolioOptions.map((option) =>
                renderCommandItem(option, handleSelect, selectedValues),
              )}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Personal Events">
              {personalOptions.map((option) =>
                renderCommandItem(option, handleSelect, selectedValues),
              )}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Additional Events">
              {additionalOptions.map((option) =>
                renderCommandItem(option, handleSelect, selectedValues),
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function renderCommandItem(
  option: Option,
  onSelect: (value: string) => void,
  selectedValues: string[],
) {
  const eventTypeInfo = getEventTypeInfo(option.value);
  const Icon = eventTypeInfo?.icon;
  return (
    <CommandItem
      key={option.value}
      value={option.value}
      onSelect={() => onSelect(option.value)}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          selectedValues.includes(option.value)
            ? eventTypeInfo?.color
            : "text-muted-foreground",
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {option.label}
      </div>
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          selectedValues.includes(option.value) ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
}
