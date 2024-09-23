import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  propertyCopyDataOptions,
  updatePropertyCopyData,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const PropertyCopyControls: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: propertyCopyData } = useQuery(propertyCopyDataOptions);

  const updatePropertyCopyMutation = useMutation({
    mutationFn: updatePropertyCopyData,
    onSuccess: (newData) => {
      queryClient.setQueryData(["propertyCopyData"], newData);
    },
  });

  const handlePropertyCopyChange = (value: string) => {
    if (!propertyCopyData) return;
    updatePropertyCopyMutation.mutate({
      ...propertyCopyData,
      propertyCopy: value,
    });
  };

  if (!propertyCopyData) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="property-copy">Property Copy</Label>
      <Textarea
        id="property-copy"
        value={propertyCopyData.propertyCopy}
        onChange={(e) => handlePropertyCopyChange(e.target.value)}
        placeholder="Enter property copy here..."
        rows={6}
      />
    </div>
  );
};

export default PropertyCopyControls;
