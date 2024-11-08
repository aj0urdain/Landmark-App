import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sectionIcons } from '@/constants/portfolioPageConstants';
import { SectionName } from '@/types/portfolioControlsTypes';
import { Dot } from '@/components/atoms/Dot/Dot';

interface SectionSelectorProps {
  onValueChange: (value: string) => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({ onValueChange }) => {
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const { data: documentData } = useQuery({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  const { data: currentSection } = useQuery({
    queryKey: ['selectedSection'],
    initialData: null as SectionName | null,
  });

  const sectionTasks = {
    Photos: [
      {
        name: 'Set Layout',
        isNecessary: true,
        isDone: documentData?.document_data?.photoData?.photoCount ?? 0 > 0,
      },
      {
        name: 'Choose Photos',
        isNecessary: false,
        isDone: documentData?.document_data?.photoData?.photos?.some(
          (photo) => photo.original !== null,
        ),
      },
    ],
    Logos: [
      {
        name: 'Set Logo Count',
        isNecessary: true,
        isDone: documentData?.document_data?.logoData?.logoCount ?? 0 > 0,
      },
      {
        name: 'Set Orientation',
        isNecessary: false,
        isDone: !!documentData?.document_data?.logoData?.logoOrientation,
      },
      {
        name: 'Upload Logos',
        isNecessary: false,
        isDone: documentData?.document_data?.logoData?.logos?.some((logo) => logo),
      },
    ],
    Headline: [
      {
        name: 'Enter Headline',
        isNecessary: true,
        isDone: !!documentData?.document_data?.headlineData?.headline,
      },
    ],
    Address: [
      {
        name: 'Enter Suburb',
        isNecessary: true,
        isDone: !!documentData?.document_data?.addressData?.suburb,
      },
      {
        name: 'Enter State',
        isNecessary: true,
        isDone: !!documentData?.document_data?.addressData?.state,
      },
      {
        name: 'Enter Additional',
        isNecessary: false,
        isDone: !!documentData?.document_data?.addressData?.additional,
      },
      {
        name: 'Enter Street',
        isNecessary: true,
        isDone: !!documentData?.document_data?.addressData?.street,
      },
    ],
    Finance: [
      {
        name: 'Enter Finance Copy',
        isNecessary: true,
        isDone: !!documentData?.document_data?.financeData?.financeCopy,
      },
      {
        name: 'Select Finance Type',
        isNecessary: true,
        isDone: !!documentData?.document_data?.financeData?.financeType,
      },
      {
        name: 'Enter Finance Amount',
        isNecessary: true,
        isDone: !!documentData?.document_data?.financeData?.financeAmount,
      },
    ],
    'Property Copy': [
      {
        name: 'Enter Property Copy',
        isNecessary: true,
        isDone: !!documentData?.document_data?.propertyCopyData?.propertyCopy,
      },
    ],
    Agents: [
      {
        name: 'Add Agents',
        isNecessary: true,
        isDone:
          documentData?.document_data?.agentsData?.agents &&
          documentData.document_data.agentsData.agents.length > 0,
      },
    ],
    'Sale Type': [
      {
        name: 'Select Sale Type',
        isNecessary: true,
        isDone: !!documentData?.document_data?.saleTypeData?.saleType,
      },
      ...(documentData?.document_data?.saleTypeData?.saleType === 'auction'
        ? [
            {
              name: 'Enter Auction Details',
              isNecessary: true,
              isDone: !!documentData?.document_data?.saleTypeData?.auctionId,
            },
          ]
        : documentData?.document_data?.saleTypeData?.saleType === 'expression'
          ? [
              {
                name: 'Enter EOI Details',
                isNecessary: true,
                isDone:
                  !!documentData?.document_data?.saleTypeData?.expressionOfInterest
                    ?.closingDate,
              },
            ]
          : []),
    ],
  };

  return (
    <Select onValueChange={onValueChange} value={currentSection ?? undefined}>
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
                          ? 'text-foreground'
                          : task.isNecessary
                            ? 'text-warning'
                            : 'text-muted-foreground'
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
