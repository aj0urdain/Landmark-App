import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddressData,
  addressDataOptions,
  updateAddress,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StateSelector from "./StateSelector/StateSelector";

const AddressControls: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: addressData } = useQuery(addressDataOptions);

  const updateAddressMutation = useMutation({
    mutationFn: (newAddressData: AddressData) => {
      if (!addressData) throw new Error("Address data not available");
      return updateAddress(newAddressData);
    },
    onSuccess: (newAddressData) => {
      queryClient.setQueryData(addressDataOptions.queryKey, newAddressData);
    },
  });

  if (!addressData) return null;

  const handleInputChange = (key: keyof AddressData, value: string) => {
    if (addressData) {
      updateAddressMutation.mutate({ ...addressData, [key]: value });
    }
  };

  const handleStateSelect = (state: string) => {
    if (addressData) {
      updateAddressMutation.mutate({ ...addressData, state });
    }
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
        <StateSelector
          selectedState={addressData.state}
          onStateSelect={handleStateSelect}
        />
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
