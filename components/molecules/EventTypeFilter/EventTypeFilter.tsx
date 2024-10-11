import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import {
  MultiSelectCombobox,
  Option,
} from "@/components/molecules/MultiSelectCombobox/MultiSelectCombobox";

const eventTypeOptions = [
  { value: "auction", label: "Auction", section: "portfolio" },
  { value: "magazine_print", label: "Magazine Print", section: "portfolio" },
  { value: "signed_schedule", label: "Signed Schedule", section: "portfolio" },
  {
    value: "magazine_deadline",
    label: "Magazine Deadline",
    section: "portfolio",
  },
  {
    value: "advertising_period",
    label: "Advertising Period",
    section: "portfolio",
  },
  { value: "birthday", label: "Birthdays", section: "personal" },
  {
    value: "work_anniversary",
    label: "Work Anniversaries",
    section: "personal",
  },
  { value: "training", label: "Training", section: "additional" },
];

interface EventTypeFilterProps {
  onFilterChange: (selectedTypes: string[]) => void;
  initialSelectedTypes: string[];
}

export function EventTypeFilter({
  onFilterChange,
  initialSelectedTypes,
}: EventTypeFilterProps) {
  const [selectedTypes, setSelectedTypes] =
    useState<string[]>(initialSelectedTypes);

  useEffect(() => {
    onFilterChange(selectedTypes);
  }, [selectedTypes, onFilterChange]);

  const handleFilterChange = (newSelectedTypes: string[]) => {
    setSelectedTypes(newSelectedTypes);
    onFilterChange(newSelectedTypes);
  };

  return (
    <div className="flex w-full animate-slide-down-fade-in flex-wrap items-center justify-end gap-4">
      <div className="flex items-center gap-2">
        <Filter className="size-3 text-muted-foreground" />
        <span className="text-xs font-medium uppercase text-muted-foreground">
          Filter Events
        </span>
      </div>
      <MultiSelectCombobox
        options={eventTypeOptions as Option[]}
        selectedValues={selectedTypes}
        onChange={handleFilterChange}
      />
    </div>
  );
}
