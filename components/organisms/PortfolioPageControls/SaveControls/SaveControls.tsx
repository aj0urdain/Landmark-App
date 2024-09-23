import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  addressDataOptions,
  agentsDataOptions,
  DocumentData,
  financeDataOptions,
  headlineDataOptions,
  logoDataOptions,
  photoDataOptions,
  propertyCopyDataOptions,
  saleTypeDataOptions,
  SaveDocumentError,
  useSavePortfolioDocument,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SaveControls = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPropertyId = searchParams.get("property");
  const documentId = searchParams.get("document");

  const { data: addressData } = useQuery(addressDataOptions);
  const { data: headlineData } = useQuery(headlineDataOptions);
  const { data: photoData } = useQuery(photoDataOptions);
  const { data: financeData } = useQuery(financeDataOptions);
  const { data: propertyCopyData } = useQuery(propertyCopyDataOptions);
  const { data: agentsData } = useQuery(agentsDataOptions);
  const { data: saleTypeData } = useQuery(saleTypeDataOptions);
  const { data: logoData } = useQuery(logoDataOptions);

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const savePortfolioMutation = useSavePortfolioDocument();

  // const areNecessaryFieldsCompleted = () => {
  //   return (
  //     !!addressData?.suburb &&
  //     !!addressData?.state &&
  //     !!addressData?.street &&
  //     !!headlineData?.headline &&
  //     !!financeData?.financeCopy &&
  //     !!financeData?.financeType &&
  //     !!financeData?.financeAmount &&
  //     !!propertyCopyData?.propertyCopy &&
  //     agentsData?.agents &&
  //     agentsData.agents.length > 0 &&
  //     !!saleTypeData?.saleType &&
  //     (saleTypeData.saleType !== "auction" || !!saleTypeData.auctionId) &&
  //     (saleTypeData.saleType !== "expression" ||
  //       (saleTypeData.expressionOfInterest &&
  //         !!saleTypeData.expressionOfInterest.closingTime &&
  //         !!saleTypeData.expressionOfInterest.closingAmPm &&
  //         !!saleTypeData.expressionOfInterest.closingDate))
  //   );
  // };

  const handleSave = async () => {
    if (!selectedPropertyId || !documentId) {
      toast({
        title: "Error",
        description: "No property or document selected",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const result = await savePortfolioMutation.mutateAsync({
        documentId: Number(documentId),
        documentData: {
          addressData: addressData,
          headlineData: headlineData,
          photoData: photoData,
          financeData: financeData,
          propertyCopyData: propertyCopyData,
          agentsData: agentsData,
          saleTypeData: saleTypeData,
          logoData: logoData,
        } as DocumentData,
      });

      // Update URL with new document ID and version number
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("document", result.documentId.toString());
      newParams.set("version", result.versionNumber.toString());
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });

      // Show success toast
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
    } catch (error) {
      console.error("Error saving document:", error);
      // Cast the error to our custom type
      const saveError = error as SaveDocumentError;
      if (saveError.toastData) {
        toast({
          ...saveError.toastData,
          action: (
            <ToastAction altText={saveError.toastData.action}>
              {saveError.toastData.action}
            </ToastAction>
          ),
        });
      } else {
        // Fallback toast if no toast data is available
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // const handleSubmit = async () => {
  //   if (!areNecessaryFieldsCompleted()) {
  //     toast({
  //       title: "Error",
  //       description: "Please complete all necessary fields before submitting",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Perform the same save operation as handleSave
  //     // You might want to add additional logic for submission here
  //     await handleSave();

  //     toast({
  //       title: "Success",
  //       description: "Document submitted successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error submitting document:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to submit document",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-end gap-2 pb-4">
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              // onClick={handleSubmit}

              variant="outline"
              className="cursor-not-allowed text-muted hover:bg-muted hover:text-muted-foreground"
            >
              Submit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Submission feature coming soon!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SaveControls;
