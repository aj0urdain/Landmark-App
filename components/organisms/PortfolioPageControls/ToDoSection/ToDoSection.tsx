import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { SectionName } from '@/types/portfolioControlsTypes';
import { sectionIcons } from '@/constants/portfolioPageConstants';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
const ToDoSection: React.FC = () => {
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const queryClient = useQueryClient();

  // Get the document data
  const { data: documentData } = useQuery({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  const incompleteItems = {
    Photos: [
      {
        isNecessary: false,
        isDone: documentData?.document_data?.photoData?.photoCount ?? 0 > 0,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Logos: [
      {
        isNecessary: false,
        isDone: documentData?.document_data?.logoData?.logoCount ?? 0 > 0,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Headline: [
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.headlineData?.headline,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Address: [
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.addressData?.addressLine1,
      },
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.addressData?.addressLine2,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Finance: [
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.financeData?.financeCopy,
      },
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.financeData?.financeType,
      },
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.financeData?.financeAmount,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    'Property Copy': [
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.propertyCopyData?.propertyCopy,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Agents: [
      {
        isNecessary: true,
        isDone:
          documentData?.document_data?.agentsData?.agents &&
          documentData.document_data.agentsData.agents.length > 0,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    'Sale Type': [
      {
        isNecessary: true,
        isDone: !!documentData?.document_data?.saleTypeData?.saleType,
      },
      {
        isNecessary: documentData?.document_data?.saleTypeData?.saleType === 'auction',
        isDone: !!documentData?.document_data?.saleTypeData?.auctionId,
      },
      {
        isNecessary: documentData?.document_data?.saleTypeData?.saleType === 'expression',
        isDone:
          !!documentData?.document_data?.saleTypeData?.expressionOfInterest?.closingDate,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
  };

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  return (
    <div className="my-2 flex items-center justify-between">
      <Label>
        <p
          className={`${
            !Object.values(incompleteItems).some((count) => count > 0) && 'text-muted'
          }`}
        >
          To Do Before Submission:
        </p>
      </Label>

      <div className="flex space-x-1">
        {Object.entries(incompleteItems).map(([section, count]) => {
          if (count > 0) {
            const IconComponent = sectionIcons[section as SectionName];
            return (
              <TooltipProvider key={section}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      key={section}
                      className="flex items-center py-0 hover:text-warning-foreground"
                      size="icon"
                      variant="ghost"
                      title={section}
                      onClick={() => {
                        updateSelectedSection(section as SectionName);
                      }}
                    >
                      <IconComponent className="mr-0.5 h-3 w-3" />
                      <span className="text-xs">{count}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-muted/50 text-warning-foreground">
                    {section}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ToDoSection;
