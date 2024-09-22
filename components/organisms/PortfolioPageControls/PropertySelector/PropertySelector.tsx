import React from "react";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { PropertyItem } from "../PropertyItem/PropertyItem";

import { FilePlus, House } from "lucide-react";
import { Property } from "@/types/portfolioControlsTypes";

interface PropertySelectorProps {
  properties: Property[];
  myProperties: Property[];
  allProperties: Property[];
  selectedPropertyId: string | null;
  onSelect: (id: string) => void;
  propertySelectorOpen: boolean;
  setPropertySelectorOpen: (open: boolean) => void;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({
  properties,
  myProperties,
  allProperties,
  selectedPropertyId,
  onSelect,
  propertySelectorOpen,
  setPropertySelectorOpen,
}) => {
  const getPropertyAddress = (property: Property) => {
    return `${property.street_number} ${property.streets.street_name}, ${property.suburbs.suburb_name} ${property.suburbs.postcode}, ${property.states.short_name}`;
  };

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId,
  );

  return (
    <Popover open={propertySelectorOpen} onOpenChange={setPropertySelectorOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={propertySelectorOpen}
          className="w-full justify-between"
        >
          {selectedProperty
            ? getPropertyAddress(selectedProperty)
            : "Select a property"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search properties..." />
          <CommandList>
            <CommandEmpty>No property found.</CommandEmpty>
            <CommandGroup heading="Sandbox Mode">
              <PropertyItem
                id="sandbox"
                address="Sandbox Mode"
                agentId="Sandbox"
                icon={FilePlus}
                isSelected={selectedPropertyId === "sandbox"}
                onSelect={onSelect}
                status={null}
                type="sandbox"
              />
            </CommandGroup>
            <CommandGroup heading="My Properties">
              {myProperties.map((property) => (
                <PropertyItem
                  key={property.id}
                  id={property.id}
                  address={getPropertyAddress(property)}
                  agentId={property.lead_agent}
                  icon={House}
                  isSelected={selectedPropertyId === property.id}
                  onSelect={onSelect}
                  status={null}
                  type="myProperty"
                />
              ))}
            </CommandGroup>
            <CommandGroup heading="All Current Portfolio Properties">
              {allProperties.map((property) => (
                <PropertyItem
                  key={property.id}
                  id={property.id}
                  address={getPropertyAddress(property)}
                  agentId={property.lead_agent}
                  icon={House}
                  isSelected={selectedPropertyId === property.id}
                  onSelect={onSelect}
                  status={null}
                  type="allProperty"
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PropertySelector;
