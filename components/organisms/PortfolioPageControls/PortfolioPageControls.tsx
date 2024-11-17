import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';

import ToDoSection from './ToDoSection/ToDoSection';
import SectionSelector from './SectionSelector/SectionSelector';
import SectionControls from './SectionControls/SectionControls';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PortfolioPageControls = ({
  isDisabled,
  canEdit,
}: {
  isDisabled: boolean;
  canEdit: boolean;
}) => {
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(null);

  const queryClient = useQueryClient();

  const { data: currentSection } = useQuery({
    queryKey: ['selectedSection'],
    initialData: null as SectionName | null,
    queryFn: () => selectedSection,
  });

  const { mutateAsync: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      // set current section to the section passed in using the query key
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
    onError: () => {
      console.log(`error`);
    },
    onSuccess: () => {
      console.log(`success`);
    },
  });

  useEffect(() => {
    if (currentSection) {
      setSelectedSection(currentSection);
    }
  }, [currentSection]);

  return (
    <Card className="h-full w-full p-4 overflow-y-scroll">
      {!isDisabled && canEdit && (
        <div className="mb-4">
          <div className="flex flex-col gap-4">
            {/* <SaveControls /> */}
            <ToDoSection />
            <SectionSelector
              onValueChange={(value) => {
                void updateSelectedSection(value as SectionName);
              }}
            />
          </div>
          <Separator className="my-8" />
          {selectedSection && (
            <div className="">
              <SectionControls selectedSection={currentSection ?? 'Headline'} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PortfolioPageControls;
