'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useEffect } from 'react';
import LocationTab from './LocationTab/LocationTab';
import HeadlineSection from './HeadlineSection/HeadlineSection';
import AddressSection from './AddressSection/AddressSection';
import FinanceCopySection from './FinanceCopySection/FinanceCopySection';
import FinanceAmountSection from './FinanceAmountSection/FinanceAmountSection';
import BottomPageBorder from './BottomPageBorder/BottomPageBorder';
import PropertyCopySection from './PropertyCopySection/PropertyCopySection';
import ContactSection from './ContactSection/ContactSection';

import LogoSection from './LogoSection/LogoSection';
import PhotoRender from './PhotoRender/PhotoRender';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@/utils/supabase/client';

const A4_ASPECT_RATIO = 297 / 210; // height / width

const PortfolioPageViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const supabase = createBrowserClient();

  const { data: documentTypes } = useQuery({
    queryKey: ['documentTypes'],
  });

  const documentTypeName = documentTypes?.find(
    (type) => type.id == selectedDocumentType,
  )?.type_name;

  const { data: previewSettings } = useQuery({
    queryKey: ['previewSettings'],
  }) as {
    data:
      | {
          zoom: number;
          scale: number;
          overlayOpacity: number;
          showOverlay: boolean;
          pageSide: 'left' | 'right';
        }
      | undefined;
  };

  const { data: documentData } = useQuery({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  const updateScale = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const containerAspectRatio = containerHeight / containerWidth;

      let newScale;
      if (containerAspectRatio > A4_ASPECT_RATIO) {
        newScale = containerWidth / 210;
      } else {
        newScale = containerHeight / 297;
      }

      queryClient.setQueryData(
        ['previewSettings'],
        (oldData: typeof previewSettings) => ({
          ...oldData,
          scale: newScale,
        }),
      );
    }
  };

  const createDocument = async () => {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        listing_id: selectedListingId ?? '',
        document_type_id: selectedDocumentType ?? '',
      })
      .select();

    if (error) {
      console.error(error);
    }

    if (!data) {
      console.error('No data returned from document creation');
    }

    console.log('Document created with supabase');
    console.log(data);

    return { data, error };
  };

  const mutateCreateDocument = useMutation({
    mutationFn: async () => {
      const { data, error } = await createDocument();
      if (error) {
        console.error(error);
        throw error;
      }

      console.log('Document created with mutation');
      console.log(data);

      return data;
    },
    onSuccess: async () => {
      console.log('Invalidating document query');
      await queryClient.invalidateQueries({
        queryKey: ['document', selectedListingId, selectedDocumentType],
        exact: true,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [previewSettings?.scale]);

  useEffect(() => {
    if (containerRef.current && previewSettings?.zoom) {
      const container = containerRef.current;
      const prevZoom = previewSettings.zoom;
      const newZoom = previewSettings.zoom;

      // Calculate the center point
      const centerX = container.scrollLeft + container.clientWidth / 2;
      const centerY = container.scrollTop + container.clientHeight / 2;

      // Adjust the scroll position
      container.scrollLeft = (centerX * newZoom) / prevZoom - container.clientWidth / 2;
      container.scrollTop = (centerY * newZoom) / prevZoom - container.clientHeight / 2;
    }
  }, [previewSettings?.zoom]);

  if (!documentData) {
    return (
      <div
        ref={containerRef}
        className="relative flex h-full w-full items-center justify-center overflow-auto"
        key={`${selectedListingId ?? ''}-${selectedDocumentType ?? ''}`}
      >
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-transparent text-gray-500"
          style={{
            width: `${210 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
            height: `${297 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
          }}
        >
          {selectedListingId && selectedDocumentType && !documentData && (
            <div className="flex flex-col gap-4 items-center justify-center w-full animate-slide-down-fade-in">
              <p className="text-warning-foreground w-2/5 text-center text-sm animate-pulse">
                The document type you have selected has not been created for this listing
                yet!
              </p>
              <Button
                onClick={() => {
                  mutateCreateDocument.mutate();
                }}
                className="animate-slide-up-fade-in"
              >
                Create {documentTypeName}
              </Button>
            </div>
          )}

          {!selectedListingId && (
            <p className="animate-pulse text-lg text-foreground">
              Select a listing to get started!
            </p>
          )}

          {!selectedDocumentType && (
            <p className="animate-pulse text-lg text-foreground">
              Select a document type to get started!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      key={`${selectedListingId ?? ''}-${selectedDocumentType ?? ''}`}
      className="relative h-full w-full overflow-auto"
    >
      <div
        className="relative"
        style={{
          width: `${210 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
          height: `${297 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
          margin: 'auto',
        }}
      >
        <div
          className="bg-white text-slate-950 shadow-lg"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {previewSettings?.showOverlay && (
            <div
              className="absolute z-20 h-full w-full"
              style={{
                backgroundImage: `url('/images/portfolio-reference.png')`,
                opacity: previewSettings.overlayOpacity,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          {/* A4 content */}

          <LocationTab />

          <PhotoRender />

          <HeadlineSection />

          <LogoSection />

          <AddressSection />

          <div className="group/finance">
            <FinanceCopySection />

            <FinanceAmountSection />
          </div>

          <PropertyCopySection />

          <ContactSection />

          <BottomPageBorder />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageViewer;
