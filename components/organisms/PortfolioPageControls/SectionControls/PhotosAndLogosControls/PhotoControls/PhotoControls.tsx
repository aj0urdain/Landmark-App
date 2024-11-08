import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PhotoLayoutSelector } from './PhotoLayoutSelector/PhotoLayoutSelector';
import PhotoSelectionDialog from './PhotoSelectionDialog/PhotoSelectionDialog';
import { useSearchParams } from 'next/navigation';

const PhotoControls: React.FC = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the document data
  const { data: documentData } = useQuery({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get draft photo data
  const { data: draftPhotoData } = useQuery({
    queryKey: ['draftPhoto', selectedListingId, selectedDocumentType],
  });

  // Initialize draft state if needed
  React.useEffect(() => {
    if (documentData && !draftPhotoData) {
      queryClient.setQueryData(['draftPhoto', selectedListingId, selectedDocumentType], {
        photoCount: documentData.document_data?.photoData?.photoCount ?? 1,
        photos: documentData.document_data?.photoData?.photos ?? [],
      });
    }
  }, [
    documentData,
    draftPhotoData,
    queryClient,
    selectedListingId,
    selectedDocumentType,
  ]);

  if (!draftPhotoData) return null;

  const renderPhotoLayout = () => {
    switch (draftPhotoData.photoCount) {
      case 1:
        return (
          <div className="flex h-full flex-col">
            <div className="h-full w-full">
              <PhotoSelectionDialog index={0} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex h-full flex-col gap-2">
            <div className="h-3/5 w-full">
              <PhotoSelectionDialog index={0} />
            </div>
            <div className="h-2/5 w-full">
              <PhotoSelectionDialog index={1} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex h-full flex-col gap-2">
            <div className="h-3/5 w-full">
              <PhotoSelectionDialog index={0} />
            </div>
            <div className="flex h-2/5 gap-2">
              <div className="h-full w-1/2">
                <PhotoSelectionDialog index={1} />
              </div>
              <div className="h-full w-1/2">
                <PhotoSelectionDialog index={2} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-3/5 gap-2">
              <div className="h-full w-1/2">
                <PhotoSelectionDialog index={0} />
              </div>
              <div className="h-full w-1/2">
                <PhotoSelectionDialog index={1} />
              </div>
            </div>
            <div className="flex h-2/5 gap-2">
              <div className="h-full w-1/2">
                <PhotoSelectionDialog index={2} />
              </div>
              <div className="h-full w-1/2">
                <PhotoSelectionDialog index={3} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4 animate-slide-down-fade-in">
      <PhotoLayoutSelector />
      <div className="aspect-[16/9] w-full rounded-lg border border-slate-900 p-4 pb-[calc(1rem+0.5rem)]">
        {renderPhotoLayout()}
      </div>
    </div>
  );
};

export default PhotoControls;
