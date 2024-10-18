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
import { Filter } from "lucide-react";

export interface Option {
  value: string;
  label: string;
  section: "portfolio" | "staff" | "company";
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

  const handleSelectAll = (section: string) => {
    const sectionOptions = options.filter(
      (option) => option.section === section,
    );
    const sectionValues = sectionOptions.map((option) => option.value);

    const allSelected = sectionValues.every((value) =>
      selectedValues.includes(value),
    );

    if (allSelected) {
      onChange(
        selectedValues.filter((value) => !sectionValues.includes(value)),
      );
    } else {
      onChange([...selectedValues, ...sectionValues]);
    }
  };

  const portfolioOptions = options.filter(
    (option) => option.section === "portfolio",
  );
  const personalOptions = options.filter(
    (option) => option.section === "staff",
  );
  const companyOptions = options.filter(
    (option) => option.section === "company",
  );

  const allSelected = selectedValues.length === options.length;

  console.log(selectedValues);
  console.log(options);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `w-full justify-between ${
              !allSelected
                ? "border border-warning-foreground/50 text-warning-foreground"
                : "text-muted-foreground/50 "
            }`,
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Filter className="size-3" />
            <p className="text-xs font-medium uppercase">
              {allSelected
                ? "No filters selected"
                : selectedValues.length > 0
                  ? `${selectedValues.length} filters selected`
                  : "Select event types..."}
            </p>
          </div>

          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
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
            <CommandGroup>
              <CommandItem
                className="flex items-center justify-between"
                style={{
                  backgroundColor: "transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Portfolio Events
                  </p>
                </div>
                <Button
                  className="-mr-2 h-fit p-0 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectAll("portfolio");
                  }}
                >
                  {portfolioOptions.every((option) =>
                    selectedValues.includes(option.value),
                  )
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </CommandItem>
              {portfolioOptions.map((option) =>
                renderCommandItem(option, handleSelect, selectedValues),
              )}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                className="flex items-center justify-between"
                style={{
                  backgroundColor: "transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Staff Events</p>
                </div>
                <Button
                  className="-mr-2 h-fit p-0 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectAll("staff");
                  }}
                >
                  {personalOptions.every((option) =>
                    selectedValues.includes(option.value),
                  )
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </CommandItem>
              {personalOptions.map((option) =>
                renderCommandItem(option, handleSelect, selectedValues),
              )}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                className="flex items-center justify-between"
                style={{
                  backgroundColor: "transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Company Events
                  </p>
                </div>
                <Button
                  className="-mr-2 h-fit p-0 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectAll("company ");
                  }}
                >
                  {companyOptions.every((option) =>
                    selectedValues.includes(option.value),
                  )
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </CommandItem>
              {companyOptions.map((option) =>
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
      className="group transition-all"
      onSelect={() => onSelect(option.value)}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          selectedValues.includes(option.value)
            ? `${eventTypeInfo?.color}`
            : "text-muted-foreground/50 group-hover:text-foreground",
        )}
      >
        {Icon && <Icon className="h-4 w-4 duration-200" />}
        <span
          className={`duration-200 group-hover:translate-x-0.5 group-hover:font-semibold ${
            !selectedValues.includes(option.value) && "transition-all"
          }`}
        >
          {option.label}
        </span>
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
