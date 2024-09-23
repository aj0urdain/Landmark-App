import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import MethodSelection from "./MethodSelection/MethodSelection";
import FileUpload from "./FileUpload/FileUpload";
import UrlInput from "./UrlInput/UrlInput";
import CloudImages from "./CloudImages/CloudImages";
import ImageCropper from "./ImageCropper/ImageCropper";
import { photoDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

interface PhotoSelectionDialogProps {
  index: number;
}

const PhotoSelectionDialog: React.FC<PhotoSelectionDialogProps> = ({
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<
    "method" | "upload" | "url" | "propertybase" | "crop"
  >("method");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: photoData } = useQuery(photoDataOptions);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setStep("crop");
  };

  const handleDialogClose = () => {
    if (!photoData?.photos[index].original) {
      setStep("method");
      setSelectedImage(null);
    }
    setIsOpen(false);
  };

  const handleBack = () => {
    setStep("method");
    setSelectedImage(null);
  };

  const renderStepContent = () => {
    switch (step) {
      case "method":
        return <MethodSelection onSelect={setStep} />;
      case "upload":
        return <FileUpload onFileSelect={handleImageSelect} />;
      case "url":
        return <UrlInput onUrlSubmit={handleImageSelect} />;
      case "propertybase":
        return <CloudImages onPhotoSelect={handleImageSelect} />;
      case "crop":
        return selectedImage ? (
          <ImageCropper
            src={selectedImage}
            index={index}
            onCropComplete={() => setIsOpen(false)}
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
          if (photoData?.photos[index].original) {
            setSelectedImage(photoData.photos[index].original);
            setStep("crop");
          }
        } else {
          handleDialogClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="relative flex h-full w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 transition hover:bg-slate-700">
          {photoData?.photos[index].cropped ? (
            <div className="relative h-full w-full">
              <Image
                src={photoData.photos[index].cropped}
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
        <DialogHeader>
          <div className="flex items-center justify-start gap-2">
            {step !== "method" && (
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
        <div className="h-full max-h-[90%] overflow-y-auto py-4">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoSelectionDialog;
