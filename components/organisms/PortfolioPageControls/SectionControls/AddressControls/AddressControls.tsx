import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StateSelector from "./StateSelector/StateSelector";
import {
  documentDataOptions,
  useUpdateDocumentData,
  AddressData,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const AddressControls: React.FC<{ documentId: number }> = ({ documentId }) => {
  const { data: documentData } = useQuery(documentDataOptions(documentId));
  const updateDocumentData = useUpdateDocumentData();

  if (!documentData) return null;

  const { addressData } = documentData;

  const handleInputChange = (key: keyof AddressData, value: string) => {
    updateDocumentData(documentId, (prevData) => ({
      ...prevData,
      addressData: { ...prevData.addressData, [key]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="suburb" className="text-xs text-muted-foreground">
            Suburb
          </Label>
          <Input
            id="suburb"
            value={addressData.suburb}
            onChange={(e) => handleInputChange("suburb", e.target.value)}
            placeholder="Enter suburb..."
          />
        </div>
        <StateSelector />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="additional" className="text-xs text-muted-foreground">
          Additional
        </Label>
        <Input
          id="additional"
          value={addressData.additional}
          onChange={(e) => handleInputChange("additional", e.target.value)}
          placeholder="Enter additional address info..."
        />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="street" className="text-xs text-muted-foreground">
          Street
        </Label>
        <Input
          id="street"
          value={addressData.street}
          onChange={(e) => handleInputChange("street", e.target.value)}
          placeholder="Enter street..."
        />
      </div>
    </div>
  );
};

export default AddressControls;
