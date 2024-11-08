import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MethodSelection from './MethodSelection/MethodSelection';
import FileUpload from './FileUpload/FileUpload';
import UrlInput from './UrlInput/UrlInput';
import CloudImages from './CloudImages/CloudImages';
import ImageCropper from './ImageCropper/ImageCropper';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';

interface PhotoSelectionDialogProps {
  index: number;
}

const PhotoSelectionDialog: React.FC<PhotoSelectionDialogProps> = ({ index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'method' | 'upload' | 'url' | 'propertybase' | 'crop'>(
    'method',
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();

  // Get draft photo data
  const { data: draftPhotoData } = useQuery({
    queryKey: ['draftPhoto', selectedListingId, selectedDocumentType],
  });

  const { data: documentData } = useQuery({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Add mutation for updating server
  const updateServerPhotoMutation = useMutation({
    mutationFn: async (photoData: any) => {
      // Initialize empty photos array if photoData doesn't exist
      const currentPhotos = documentData?.document_data?.photoData?.photos || [];
      const updatedPhotos = [...currentPhotos];

      // Update or add the photo at the specified index
      updatedPhotos[index] = photoData;

      const { error } = await supabase
        .from('documents')
        .update({
          document_data: {
            ...documentData?.document_data,
            photoData: {
              ...(documentData?.document_data?.photoData || {}),
              photos: updatedPhotos,
              photoCount: Math.max(
                index + 1,
                documentData?.document_data?.photoData?.photoCount || 1,
              ),
            },
          },
        })
        .eq('id', documentData?.id ?? '');

      if (error) throw error;
    },
    onError: (error) => {
      console.error('Error updating photo:', error);
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving photo!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your photo to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['document', selectedListingId, selectedDocumentType],
      });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your photo has been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
      setIsOpen(false);
    },
  });

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setStep('crop');
  };

  const handleDialogClose = () => {
    if (!draftPhotoData?.photos?.[index]?.original) {
      setStep('method');
      setSelectedImage(null);
    }
    setIsOpen(false);
  };

  const handleBack = () => {
    setStep('method');
    setSelectedImage(null);
  };

  const handleCropComplete = async () => {
    const currentDraftData = queryClient.getQueryData([
      'draftPhoto',
      selectedListingId,
      selectedDocumentType,
    ]);

    if (currentDraftData?.photos?.[index]) {
      await updateServerPhotoMutation.mutateAsync(currentDraftData.photos[index]);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'method':
        return <MethodSelection onSelect={setStep} />;
      case 'upload':
        return <FileUpload onFileSelect={handleImageSelect} />;
      case 'url':
        return <UrlInput onUrlSubmit={handleImageSelect} />;
      case 'propertybase':
        return <CloudImages onPhotoSelect={handleImageSelect} />;
      case 'crop':
        return selectedImage ? (
          <ImageCropper
            src={selectedImage}
            index={index}
            onCropComplete={handleCropComplete}
            onCancel={handleBack}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setIsOpen(true);
          if (draftPhotoData?.photos?.[index]?.original) {
            setSelectedImage(draftPhotoData.photos[index].original);
            setStep('crop');
          }
        } else {
          handleDialogClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="relative flex h-full w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 transition hover:bg-slate-700">
          {draftPhotoData?.photos?.[index]?.cropped ? (
            <div className="relative h-full w-full">
              <Image
                src={draftPhotoData.photos[index].cropped}
                alt={`Photo ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <>
              <Camera className="h-4 w-4 text-white" />
              <p className="text-xs font-bold text-white">Add Photo</p>
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="h-full max-h-[90%] max-w-7xl overflow-y-scroll">
        <DialogHeader className="flex h-fit flex-col items-start justify-start gap-2">
          <div className="flex items-center justify-start gap-2">
            {step !== 'method' && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <DialogTitle>Select Photo</DialogTitle>
          </div>
          <DialogDescription>
            Choose a method to add your photo, then crop it to fit.
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto py-4">{renderStepContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoSelectionDialog;
