import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PhotoLayoutSelector } from './PhotoLayoutSelector/PhotoLayoutSelector';
import PhotoSelectionDialog from './PhotoSelectionDialog/PhotoSelectionDialog';
import { photoDataOptions } from '@/utils/sandbox/document-generator/portfolio-page/portfolio-queries';

const PhotoControls: React.FC = () => {
  const { data: photoData } = useQuery(photoDataOptions);

  if (!photoData) return null;

  const renderPhotoLayout = () => {
    switch (photoData.photoCount) {
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
    <div className="w-full space-y-4">
      <PhotoLayoutSelector />
      <div className="aspect-[16/9] w-full rounded-lg border border-slate-900 p-4 pb-[calc(1rem+0.5rem)]">
        {renderPhotoLayout()}
      </div>
    </div>
  );
};

export default PhotoControls;
