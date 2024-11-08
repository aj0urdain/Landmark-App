import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAspectRatio } from '@/utils/sandbox/document-generator/portfolio-page/getAspectRatio';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

interface ImageCropperProps {
  src: string;
  index: number;
  onCropComplete: () => void;
  onCancel: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  index,
  onCropComplete,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const { data: photoData } = useQuery({
    queryKey: ['draftPhoto', selectedListingId, selectedDocumentType],
  });

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const aspect = photoData ? getAspectRatio(photoData.photoCount, index) : 16 / 9;

  console.log(scale);

  const updatePhotoMutation = useMutation({
    mutationFn: (newPhotoData: {
      original: string;
      cropped: string;
      crop: { x: number; y: number; width: number; height: number };
    }) => {
      if (!photoData) throw new Error('Photo data not available');
      const updatedPhotos = [...photoData.photos];
      updatedPhotos[index] = {
        ...updatedPhotos[index],
        original: newPhotoData.original,
        cropped: newPhotoData.cropped,
        crop: newPhotoData.crop,
      };

      return Promise.resolve({
        ...photoData,
        photos: updatedPhotos,
      });
    },
    onSuccess: (newPhotoData) => {
      queryClient.setQueryData(
        ['draftPhoto', selectedListingId, selectedDocumentType],
        newPhotoData,
      );
      onCropComplete();
    },
  });

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
      const savedCrop = photoData?.photos[index]?.crop;

      // Calculate scale
      const containerWidth = 800; // Adjust this to your container width
      const containerHeight = 600; // Adjust this to your container height
      const widthScale = containerWidth / naturalWidth;
      const heightScale = containerHeight / naturalHeight;
      const newScale = Math.min(widthScale, heightScale, 1);
      setScale(newScale);

      if (savedCrop) {
        // Convert saved crop to percentage
        const percentCrop: Crop = {
          unit: '%',
          x: (savedCrop.x / naturalWidth) * 100,
          y: (savedCrop.y / naturalHeight) * 100,
          width: (savedCrop.width / naturalWidth) * 100,
          height: (savedCrop.height / naturalHeight) * 100,
        };
        setCrop(percentCrop);
      } else {
        setCrop(centerAspectCrop(width, height, aspect));
      }
    },
    [photoData, index, aspect],
  );

  useEffect(() => {
    if (imgRef.current && crop) {
      const { width, height } = imgRef.current;
      setCompletedCrop(convertToPixelCrop(crop, width, height));
    }
  }, [crop]);

  const handleCropComplete = useCallback(async () => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas size to match the original image size
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }

        const supabase = createBrowserClient();
        const file = new File([blob], `cropped_image_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        const { data, error } = await supabase.storage
          .from('user_uploads')
          .upload(`cropped_images/${file.name}`, file, {
            cacheControl: '3600',
            upsert: false,
          });

        console.log(data);

        if (error) {
          console.error('Error uploading file:', error);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(`cropped_images/${file.name}`);

        const croppedImageUrl = urlData.publicUrl;

        updatePhotoMutation.mutate({
          original: src,
          cropped: croppedImageUrl,
          crop: {
            x: completedCrop.x * scaleX,
            y: completedCrop.y * scaleY,
            width: completedCrop.width * scaleX,
            height: completedCrop.height * scaleY,
          },
        });
      }, 'image/jpeg');
    }
  }, [completedCrop, imgRef, src, updatePhotoMutation]);

  return (
    <div className="flex flex-col items-center">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspect}
      >
        <img
          ref={imgRef}
          src={src}
          alt="Crop me"
          onLoad={onImageLoad}
          style={{
            maxHeight: '600px',
            maxWidth: '800px',
            width: 'auto',
            height: 'auto',
          }}
          crossOrigin="anonymous"
        />
      </ReactCrop>
      <canvas
        ref={previewCanvasRef}
        style={{
          display: 'none', // Hide the canvas, we just need it for processing
        }}
      />
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleCropComplete}>Save Crop</Button>
      </div>
    </div>
  );
};

export default ImageCropper;
