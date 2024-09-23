import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import PropertySelector from "./PropertySelector/PropertySelector";
import ToDoSection from "./ToDoSection/ToDoSection";
import SectionSelector from "./SectionSelector/SectionSelector";
import SectionControls from "./SectionControls/SectionControls";
import { SectionName } from "@/types/portfolioControlsTypes";
import { useQuery } from "@tanstack/react-query";

import { User } from "lucide-react";
import {
  documentDataOptions,
  portfolioPagePropertyOptions,
  leadAgentProfileOptions,
  useSavePortfolioDocument,
  DocumentData,
  propertiesOptions,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { SaveDocumentError } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queriesOLD";

const PortfolioPageControls = ({
  isDisabled,
  canEdit,
}: {
  isDisabled: boolean;
  canEdit: boolean;
}) => {
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(
    null,
  );
  const [propertySelectorOpen, setPropertySelectorOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPropertyId = searchParams.get("property");
  const documentId = searchParams.get("document");

  const { data: documentData } = useQuery(
    documentDataOptions(Number(documentId)),
  );
  const { data: propertyData } = useQuery(
    portfolioPagePropertyOptions(selectedPropertyId),
  );
  const { data: leadAgentProfile } = useQuery(
    leadAgentProfileOptions(propertyData?.lead_agent),
  );
  const { data: properties } = useQuery(propertiesOptions());

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const savePortfolioMutation = useSavePortfolioDocument();

  const handlePropertySelect = (id: string) => {
    const newParams = new URLSearchParams();
    newParams.set("property", id);
    router.push(`${pathname}?${newParams.toString()}`, {
      scroll: false,
    });
    setPropertySelectorOpen(false);
  };

  const areNecessaryFieldsCompleted = () => {
    if (!documentData) return false;
    const {
      addressData,
      headlineData,
      financeData,
      propertyCopyData,
      agentsData,
      saleTypeData,
    } = documentData;
    return (
      !!addressData?.suburb &&
      !!addressData?.state &&
      !!addressData?.street &&
      !!headlineData?.headline &&
      !!financeData?.financeCopy &&
      !!financeData?.financeType &&
      !!financeData?.financeAmount &&
      !!propertyCopyData?.propertyCopy &&
      agentsData?.agents &&
      agentsData.agents.length > 0 &&
      !!saleTypeData?.saleType &&
      (saleTypeData.saleType !== "auction" || !!saleTypeData.auctionId) &&
      (saleTypeData.saleType !== "expression" ||
        (saleTypeData.expressionOfInterest &&
          !!saleTypeData.expressionOfInterest.closingTime &&
          !!saleTypeData.expressionOfInterest.closingAmPm &&
          !!saleTypeData.expressionOfInterest.closingDate))
    );
  };

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
        documentData: documentData as DocumentData,
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
        action: <ToastAction altText="View">View</ToastAction>,
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

  const handleSubmit = async () => {
    if (!areNecessaryFieldsCompleted()) {
      toast({
        title: "Error",
        description: "Please complete all necessary fields before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Perform the same save operation as handleSave
      // You might want to add additional logic for submission here
      await handleSave();

      toast({
        title: "Success",
        description: "Document submitted successfully",
        action: <ToastAction altText="View document">View</ToastAction>,
      });
    } catch (error) {
      console.error("Error submitting document:", error);
      toast({
        title: "Error",
        description: "Failed to submit document",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full w-[45%] p-4">
      <div className="mb-4">
        <Label>Choose a property</Label>
        <PropertySelector
          properties={properties?.allProperties || []}
          myProperties={properties?.myProperties || []}
          allProperties={properties?.allProperties || []}
          selectedPropertyId={selectedPropertyId}
          onSelect={handlePropertySelect}
          propertySelectorOpen={propertySelectorOpen}
          setPropertySelectorOpen={setPropertySelectorOpen}
        />
        <CardContent className="p-0 px-2 pt-6">
          {propertyData ? (
            <div
              className="animate-slide-down-fade-in text-sm"
              key={propertyData.id}
            >
              <p className="text-lg font-bold">
                {propertyData.street_number} {propertyData.streets?.street_name}
                , {propertyData?.suburbs?.suburb_name}
              </p>
              <p className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                {leadAgentProfile?.first_name} {leadAgentProfile?.last_name}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No property selected
            </p>
          )}
        </CardContent>
      </div>
      {!isDisabled && canEdit && (
        <div className="mb-4">
          <Separator className="my-8" />

          <div className="flex space-x-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !areNecessaryFieldsCompleted()}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>

          <ToDoSection />
          <SectionSelector
            onValueChange={(value) => setSelectedSection(value as SectionName)}
          />
          <Separator className="my-8" />
          {selectedSection && (
            <div className="mt-4">
              <SectionControls selectedSection={selectedSection} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PortfolioPageControls;
