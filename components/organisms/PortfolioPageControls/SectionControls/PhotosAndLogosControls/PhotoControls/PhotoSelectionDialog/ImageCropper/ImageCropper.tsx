import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  photoDataOptions,
  updatePhoto,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";

interface ImageCropperProps {
  src: string;
  index: number;
  onCropComplete: () => void;
  onCancel: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
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
  const { data: photoData } = useQuery(photoDataOptions);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const aspect = 16 / 9;

  const updatePhotoMutation = useMutation({
    mutationFn: (newPhotoData: {
      original: string;
      cropped: string;
      crop: { x: number; y: number; width: number; height: number };
    }) => {
      if (!photoData) throw new Error("Photo data not available");
      return updatePhoto(
        index,
        newPhotoData.original,
        newPhotoData.cropped,
        newPhotoData.crop,
        photoData,
      );
    },
    onSuccess: (newPhotoData) => {
      queryClient.setQueryData(photoDataOptions.queryKey, newPhotoData);
      onCropComplete();
    },
  });

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const savedCrop = photoData?.photos[index].crop;

      if (savedCrop) {
        // Convert saved crop to percentage
        const percentCrop: Crop = {
          unit: "%",
          x: (savedCrop.x / width) * 100,
          y: (savedCrop.y / height) * 100,
          width: (savedCrop.width / width) * 100,
          height: (savedCrop.height / height) * 100,
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
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height,
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        updatePhotoMutation.mutate({
          original: src,
          cropped: croppedImageUrl,
          crop: {
            x: completedCrop.x,
            y: completedCrop.y,
            width: completedCrop.width,
            height: completedCrop.height,
          },
        });
      }, "image/jpeg");
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
          style={{ maxHeight: "300px", width: "auto" }}
          crossOrigin="anonymous"
        />
      </ReactCrop>
      <canvas
        ref={previewCanvasRef}
        style={{
          display: "none", // Hide the canvas, we just need it for processing
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
