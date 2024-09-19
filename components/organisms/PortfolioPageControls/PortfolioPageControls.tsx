"use client";

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
  FileClock,
  Brush,
  UserRoundPen,
  CircleCheck,
  House,
  FilePlus,
  User,
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
import { Heading1Icon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import PropertyCopyControls from "@/components/organisms/PortfolioPageControls/SectionControls/PropertyCopyControls/PropertyCopyControls";
import HeadlineControls from "@/components/organisms/PortfolioPageControls/SectionControls/HeadlineControls/HeadlineControls";
import AddressControls from "@/components/organisms/PortfolioPageControls/SectionControls/AddressControls/AddressControls";
import FinanceControls from "@/components/organisms/PortfolioPageControls/SectionControls/FinanceControls/FinanceControls";
import AgentsControls from "@/components/organisms/PortfolioPageControls/SectionControls/AgentsControls/AgentsControls";
import SaleTypeControls from "@/components/organisms/PortfolioPageControls/SectionControls/SaleTypeControls/SaleTypeControls";
import PhotoControls from "@/components/organisms/PortfolioPageControls/SectionControls/PhotosAndLogosControls/PhotoControls/PhotoControls";
import LogoControls from "@/components/organisms/PortfolioPageControls/SectionControls/PhotosAndLogosControls/LogoControls/LogoControls";

type SectionName =
  | "Photos"
  | "Logos"
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
  Photos: Image,
  Logos: Image,
  Headline: Heading1Icon,
  Address: MapPin,
  Finance: DollarSign,
  "Property Copy": FileText,
  Agents: Users,
  "Sale Type": Tag,
};

type ListingStatus =
  | "inProgress"
  | "pendingDesignApproval"
  | "pendingAgentApproval"
  | "approved"
  | null;

interface ListingItemProps {
  id: string;
  address: string;
  agent: string;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
  status: ListingStatus;
  type: string;
}

const ListingItem: React.FC<ListingItemProps> = ({
  id,
  address,
  agent,
  icon: Icon,
  isSelected,
  onSelect,
  status,
  type,
}) => {
  const getStatusIcon = (status: ListingStatus) => {
    switch (status) {
      case "inProgress":
        return <FileClock className="h-4 w-4 text-yellow-500" />;
      case "pendingDesignApproval":
        return <Brush className="h-4 w-4 text-blue-500" />;
      case "pendingAgentApproval":
        return <UserRoundPen className="h-4 w-4 text-purple-500" />;
      case "approved":
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ListingStatus) => {
    switch (status) {
      case "inProgress":
        return "In Progress";
      case "pendingDesignApproval":
        return "Pending Design Approval";
      case "pendingAgentApproval":
        return "Pending Agent Approval";
      case "approved":
        return "Approved";
      default:
        return "No status";
    }
  };

  return (
    <CommandItem onSelect={() => onSelect(id)}>
      <div className="flex w-full items-center">
        <div className="mr-2 flex flex-col items-center">
          <Icon className="mb-1 h-4 w-4" />
          {status && (
            <HoverCard>
              <HoverCardTrigger>{getStatusIcon(status)}</HoverCardTrigger>
              <HoverCardContent>
                <p>{getStatusText(status)}</p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <div className="flex flex-grow flex-col">
          <span>{address}</span>
          <div className="flex items-center gap-1">
            {type !== "sandbox" && (
              <User className="h-3 w-3 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">{agent}</span>
          </div>
        </div>
        <CheckIcon
          className={cn(
            "ml-2 h-4 w-4 flex-shrink-0",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    </CommandItem>
  );
};

const PortfolioPageControls = () => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const listings = [
    {
      id: "my1",
      address: "123 Main St, Sydney NSW 2000",
      agent: "John Smith",
      type: "myListing",
      icon: House,
      status: "inProgress" as const,
    },
    {
      id: "my2",
      address: "456 Park Ave, Melbourne VIC 3000",
      agent: "Emma Johnson",
      type: "myListing",
      icon: House,
      status: "pendingDesignApproval" as const,
    },
    {
      id: "all1",
      address: "789 Beach Rd, Gold Coast QLD 4217",
      agent: "Michael Brown",
      type: "allListing",
      icon: House,
      status: "pendingAgentApproval" as const,
    },
    {
      id: "all2",
      address: "101 River St, Perth WA 6000",
      agent: "Sarah Davis",
      type: "allListing",
      icon: House,
      status: "approved" as const,
    },
    {
      id: "sandbox",
      address: "Sandbox Mode",
      agent: "Make a page from scratch",
      type: "sandbox",
      icon: FilePlus,
      status: null,
    },
  ];

  // Dummy data for incomplete items
  const incompleteItems = {
    Photos: 2,
    Logos: 2,
    Headline: 1,
    Address: 1,
    Finance: 3,
    "Property Copy": 1,
    Agents: 2,
    "Sale Type": 4,
  };

  const sectionStatus: Record<string, SectionStatus> = {
    Photos: { necessary: 1, optional: 1 },
    Logos: { necessary: 1, optional: 1 },
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
      case "Photos":
        return <PhotoControls />;
      case "Logos":
        return <LogoControls />;
      case "Headline":
        return <HeadlineControls />;
      case "Address":
        return <AddressControls />;
      case "Finance":
        return <FinanceControls />;
      case "Agents":
        return <AgentsControls />;
      case "Sale Type":
        return <SaleTypeControls />;
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
                      <ListingItem
                        key={listing.id}
                        id={listing.id}
                        address={listing.address}
                        agent={listing.agent}
                        icon={listing.icon}
                        isSelected={value === listing.id}
                        onSelect={(id) => {
                          setValue(id);
                          setOpen(false);
                        }}
                        status={listing.status}
                        type={listing.type}
                      />
                    ))}
                </CommandGroup>
                <CommandGroup heading="My Listings">
                  {listings
                    .filter((listing) => listing.type === "myListing")
                    .map((listing) => (
                      <ListingItem
                        key={listing.id}
                        id={listing.id}
                        address={listing.address}
                        agent={listing.agent}
                        icon={listing.icon}
                        isSelected={value === listing.id}
                        onSelect={(id) => {
                          setValue(id);
                          setOpen(false);
                        }}
                        status={listing.status}
                        type={listing.type}
                      />
                    ))}
                </CommandGroup>
                <CommandGroup heading="All Current Portfolio Listings">
                  {listings
                    .filter((listing) => listing.type === "allListing")
                    .map((listing) => (
                      <ListingItem
                        key={listing.id}
                        id={listing.id}
                        address={listing.address}
                        agent={listing.agent}
                        icon={listing.icon}
                        isSelected={value === listing.id}
                        onSelect={(id) => {
                          setValue(id);
                          setOpen(false);
                        }}
                        status={listing.status}
                        type={listing.type}
                      />
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
          <Label>To Do:</Label>
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

        <Separator className="my-8" />

        {selectedSection && (
          <div className="mt-4">{renderSectionControls()}</div>
        )}
      </div>
    </Card>
  );
};

export default PortfolioPageControls;
