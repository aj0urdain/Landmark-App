import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  headlineDataOptions,
  updateHeadline,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const HeadlineControls: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: headlineData } = useQuery(headlineDataOptions);

  const updateHeadlineMutation = useMutation({
    mutationFn: (newHeadline: string) => {
      if (!headlineData) throw new Error("Headline data not available");
      return updateHeadline(newHeadline, headlineData);
    },
    onSuccess: (newHeadlineData) => {
      queryClient.setQueryData(headlineDataOptions.queryKey, newHeadlineData);
    },
  });

  if (!headlineData) return null;

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHeadlineMutation.mutate(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="headline" className="text-xs text-muted-foreground">
        Headline
      </Label>
      <Input
        id="headline"
        value={headlineData.headline}
        onChange={handleHeadlineChange}
        placeholder="Enter headline..."
      />
    </div>
  );
};

export default HeadlineControls;
