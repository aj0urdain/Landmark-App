import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Heading1Icon, Minus, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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

// Add these new imports

// ... import other section-specific controls as needed

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

interface PortfolioPageControlsProps {
  setOverlayOpacity: (opacity: number) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  content: string;
  setContent: (content: string) => void;
}

const PortfolioPageControls = ({
  setOverlayOpacity,
  zoom,
  onZoomIn,
  onZoomOut,
  content,
  setContent,
}: PortfolioPageControlsProps) => {
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
        <h3 className="mb-2 text-lg font-semibold">Overlay Opacity</h3>
        <Slider
          defaultValue={[50]}
          max={100}
          min={0}
          step={1}
          onValueChange={(value) => setOverlayOpacity(value[0] / 100)}
        />
      </div>
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-semibold">Zoom Controls</h3>
        <div className="flex space-x-2">
          <button
            onClick={onZoomOut}
            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            <Minus size={20} />
          </button>
          <span className="flex items-center rounded bg-gray-200 px-2">
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={onZoomIn}
            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Content</h3>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here. Each new line will create a new block."
            className="h-40"
          />
        </div>

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
