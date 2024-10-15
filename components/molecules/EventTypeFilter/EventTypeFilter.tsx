import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import {
  MultiSelectCombobox,
  Option,
} from "@/components/molecules/MultiSelectCombobox/MultiSelectCombobox";
import { getEventTypeOptions } from "@/utils/eventTypeInfo";

const eventTypeOptions = getEventTypeOptions().filter(
  (option) => option.value !== "default",
);

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
