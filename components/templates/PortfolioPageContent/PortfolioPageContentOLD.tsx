'use client';

import React, { useState } from 'react';
import PortfolioPageViewer from '@/components/templates/PortfolioPageViewer/PortfolioPageViewer';
import { Card } from '@/components/ui/card';
import PortfolioPageControls from '@/components/organisms/PortfolioPageControls/PortfolioPageControls';
import PreviewControls from '@/components/organisms/PortfolioPageControls/PreviewControls/PreviewControls';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { useDocumentSetup } from '@/utils/sandbox/document-generator/portfolio-page/portfolio-queries';

const PortfolioPageContent = () => {
  const searchParams = useSearchParams();
  const selectedPropertyId = searchParams.get('property') ?? null;

  const [rerenderKey, setRerenderKey] = useState(0);

  const { data, isLoading, isError } = useDocumentSetup(selectedPropertyId);

  const { data: previewSettings } = useQuery({
    queryKey: ['previewSettings'],
    queryFn: () => ({
      zoom: 1,
      overlayOpacity: 0.5,
      showOverlay: false,
      pageSide: 'right' as 'right' | 'left',
    }),
  });

  if (!previewSettings) return null;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        <PortfolioPageControls
          isDisabled={!selectedPropertyId || isLoading}
          // canEdit={data?.canEdit ?? false}
          canEdit={true}
          renderError={isError}
          isLoading={isLoading}
        />
        <div className="relative z-10 flex h-full w-[55%] flex-col gap-4">
          <PreviewControls
            isDisabled={!selectedPropertyId}
            setRerenderKey={setRerenderKey}
          />
          <Card className="flex h-full overflow-hidden">
            <PortfolioPageViewer
              isLoading={isLoading}
              renderEmpty={isLoading}
              renderError={isError}
              selectedPropertyId={selectedPropertyId}
              keyInt={rerenderKey}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageContent;
