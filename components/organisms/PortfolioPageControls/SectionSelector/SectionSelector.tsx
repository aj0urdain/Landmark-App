import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sectionIcons } from "@/constants/portfolioPageConstants";
import { SectionName } from "@/types/portfolioControlsTypes";
import {
  photoDataOptions,
  headlineDataOptions,
  addressDataOptions,
  financeDataOptions,
  propertyCopyDataOptions,
  agentsDataOptions,
  saleTypeDataOptions,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { Dot } from "@/components/atoms/Dot/Dot";

interface SectionSelectorProps {
  onValueChange: (value: string) => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({ onValueChange }) => {
  const { data: photoData } = useQuery(photoDataOptions);
  const { data: headlineData } = useQuery(headlineDataOptions);
  const { data: addressData } = useQuery(addressDataOptions);
  const { data: financeData } = useQuery(financeDataOptions);
  const { data: propertyCopyData } = useQuery(propertyCopyDataOptions);
  const { data: agentsData } = useQuery(agentsDataOptions);
  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  const sectionTasks = {
    Photos: [
      {
        name: "Set Layout",
        isNecessary: true,
        isDone: photoData?.photoCount ?? 0 > 0,
      },
      {
        name: "Choose Photos",
        isNecessary: false,
        isDone: photoData?.photos.some((photo) => photo.original !== null),
      },
    ],
    Logos: [
      { name: "Choose Logo Count", isNecessary: false, isDone: false },
      { name: "Set Orientation", isNecessary: false, isDone: false },
      { name: "Upload Logos", isNecessary: false, isDone: false },
    ],
    Headline: [
      {
        name: "Enter Headline",
        isNecessary: true,
        isDone: !!headlineData?.headline,
      },
    ],
    Address: [
      {
        name: "Enter Suburb",
        isNecessary: true,
        isDone: !!addressData?.suburb,
      },
      { name: "Enter State", isNecessary: true, isDone: !!addressData?.state },
      {
        name: "Enter Additional",
        isNecessary: false,
        isDone: !!addressData?.additional,
      },
      {
        name: "Enter Street",
        isNecessary: true,
        isDone: !!addressData?.street,
      },
    ],
    Finance: [
      {
        name: "Enter Finance Copy",
        isNecessary: true,
        isDone: !!financeData?.financeCopy,
      },
      {
        name: "Select Finance Type",
        isNecessary: true,
        isDone: !!financeData?.financeType,
      },
      {
        name: "Enter Finance Amount",
        isNecessary: true,
        isDone: !!financeData?.financeAmount,
      },
    ],
    "Property Copy": [
      {
        name: "Enter Property Copy",
        isNecessary: true,
        isDone: !!propertyCopyData?.propertyCopy,
      },
    ],
    Agents: [
      {
        name: "Add Agents",
        isNecessary: true,
        isDone: agentsData?.agents && agentsData.agents.length > 0,
      },
    ],
    "Sale Type": [
      {
        name: "Select Sale Type",
        isNecessary: true,
        isDone: !!saleTypeData?.saleType,
      },
      ...(saleTypeData?.saleType === "auction"
        ? [
            {
              name: "Enter Auction Details",
              isNecessary: true,
              isDone: !!saleTypeData?.auctionId,
            },
          ]
        : saleTypeData?.saleType === "expression"
          ? [
              {
                name: "Enter EOI Details",
                isNecessary: true,
                isDone: !!saleTypeData?.expressionOfInterest?.closingDate,
              },
            ]
          : []),
    ],
  };

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="h-fit w-full">
        <SelectValue placeholder="Select a section" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sections</SelectLabel>
          {Object.entries(sectionTasks).map(([section, tasks]) => {
            const IconComponent = sectionIcons[section as SectionName];
            return (
              <SelectItem
                key={section}
                value={section}
                className="flex flex-col items-start justify-start border-b border-muted py-4"
              >
                <div className="flex items-center gap-0">
                  <IconComponent className="mr-1 h-4 w-4" />
                  <span className="font-bold">{section}</span>
                </div>
                <div className="mt-2 flex space-x-3">
                  {tasks.map((task, index) => (
                    <span
                      key={index}
                      className={`flex items-center gap-1 text-xs ${
                        task.isDone
                          ? "text-foreground"
                          : task.isNecessary
                            ? "text-warning"
                            : "text-muted-foreground"
                      }`}
                    >
                      {task.isNecessary && !task.isDone && (
                        <Dot
                          size="small"
                          className="animate-pulse bg-warning-foreground"
                        />
                      )}
                      {task.name}
                    </span>
                  ))}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SectionSelector;
