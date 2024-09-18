import { Card } from "@/components/ui/card";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Image,
  MapPin,
  DollarSign,
  FileText,
  Users,
  Tag,
  LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PropertyCopyControls from "./PropertyCopyControls/PropertyCopyControls";
import PhotosAndLogoControls from "./PhotosAndLogosControls/PhotosAndLogoControls";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { House, FilePlus, Heading1Icon } from "lucide-react";

// Add this near the top of your file
const listings = [
  {
    id: "my1",
    address: "123 Main St, Sydney NSW 2000",
    agent: "John Smith",
    type: "myListing",
    icon: House,
  },
  {
    id: "my2",
    address: "456 Park Ave, Melbourne VIC 3000",
    agent: "Emma Johnson",
    type: "myListing",
    icon: House,
  },
  {
    id: "all1",
    address: "789 Beach Rd, Gold Coast QLD 4217",
    agent: "Michael Brown",
    type: "allListing",
    icon: House,
  },
  {
    id: "all2",
    address: "101 River St, Perth WA 6000",
    agent: "Sarah Davis",
    type: "allListing",
    icon: House,
  },
  {
    id: "sandbox",
    address: "Sandbox Mode",
    agent: "Make a page from scratch",
    type: "sandbox",
    icon: FilePlus,
  },
];

type SectionName =
  | "Photos & Logos"
  | "Headline"
  | "Address"
  | "Finance"
  | "Property Copy"
  | "Agents"
  | "Sale Type";

type SectionStatus = {
  necessary: number;
  optional: number;
};

const sectionIcons: Record<SectionName, LucideIcon> = {
  "Photos & Logos": Image,
  Headline: Heading1Icon,
  Address: MapPin,
  Finance: DollarSign,
  "Property Copy": FileText,
  Agents: Users,
  "Sale Type": Tag,
};

const PortfolioPageControls = () => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  // Dummy data for incomplete items
  const incompleteItems = {
    "Photos & Logos": 2,
    Headline: 1,
    Address: 1,
    Finance: 3,
    "Property Copy": 1,
    Agents: 2,
    "Sale Type": 4,
  };

  const sectionStatus: Record<string, SectionStatus> = {
    "Photos & Logos": { necessary: 1, optional: 1 },
    Headline: { necessary: 1, optional: 0 },
    Address: { necessary: 1, optional: 0 },
    Finance: { necessary: 2, optional: 1 },
    "Property Copy": { necessary: 0, optional: 1 },
    Agents: { necessary: 1, optional: 1 },
    "Sale Type": { necessary: 2, optional: 2 },
  };

  const [selectedSection, setSelectedSection] = useState<SectionName | null>(
    null,
  );

  const renderSectionControls = () => {
    switch (selectedSection) {
      case "Property Copy":
        return <PropertyCopyControls />;
      case "Photos & Logos":
        return <PhotosAndLogoControls />;
      // ... add cases for other sections
      default:
        return null;
    }
  };

  return (
    <Card className="h-full w-[45%] p-4">
      <div className="mb-4">
        <Label>Choose a listing</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? listings.find((listing) => listing.id === value)?.address
                : "Select a listing"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            <Command>
              <CommandInput placeholder="Search these listings..." />
              <CommandList>
                <CommandEmpty>No listing found.</CommandEmpty>
                <CommandGroup heading="Sandbox Mode">
                  {listings
                    .filter((listing) => listing.type === "sandbox")
                    .map((listing) => (
                      <CommandItem
                        key={listing.id}
                        onSelect={() => {
                          setValue(listing.id);
                          setOpen(false);
                        }}
                      >
                        <FilePlus className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{listing.address}</span>
                          <span className="text-sm text-muted-foreground">
                            {listing.agent}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === listing.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="My Listings">
                  {listings
                    .filter((listing) => listing.type === "myListing")
                    .map((listing) => (
                      <CommandItem
                        key={listing.id}
                        onSelect={() => {
                          setValue(listing.id);
                          setOpen(false);
                        }}
                      >
                        <House className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{listing.address}</span>
                          <span className="text-sm text-muted-foreground">
                            {listing.agent}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === listing.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="All Current Portfolio Listings">
                  {listings
                    .filter((listing) => listing.type === "allListing")
                    .map((listing) => (
                      <CommandItem
                        key={listing.id}
                        onSelect={() => {
                          setValue(listing.id);
                          setOpen(false);
                        }}
                      >
                        <House className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{listing.address}</span>
                          <span className="text-sm text-muted-foreground">
                            {listing.agent}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === listing.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="mb-4">
        <Separator className="my-8" />
        <div className="mb-2 flex items-center justify-between">
          <Label>Outstanding</Label>
          <div className="flex space-x-2">
            {Object.entries(incompleteItems).map(([section, count]) => {
              if (count > 0) {
                const IconComponent = sectionIcons[section as SectionName];
                return (
                  <div
                    key={section}
                    className="flex items-center"
                    title={section}
                  >
                    <IconComponent className="mr-1 h-4 w-4" />
                    <span className="text-xs">{count}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <Select
          onValueChange={(value) => setSelectedSection(value as SectionName)}
        >
          <SelectTrigger className="h-fit w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sections</SelectLabel>
              {Object.entries(sectionStatus).map(([section, status]) => {
                const IconComponent = sectionIcons[section as SectionName];
                return (
                  <SelectItem
                    key={section}
                    value={section}
                    className="flex flex-col items-start justify-start gap-4"
                  >
                    <div className="flex items-center">
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{section}</span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      {status.necessary > 0 && (
                        <Badge
                          variant="outline"
                          className="border-destructive text-destructive"
                        >
                          {status.necessary} necessary
                        </Badge>
                      )}
                      {status.optional > 0 && (
                        <Badge
                          variant="outline"
                          className="border-warning text-warning"
                        >
                          {status.optional} optional
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        {selectedSection && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">
              {selectedSection} Controls
            </h3>
            {renderSectionControls()}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PortfolioPageControls;
