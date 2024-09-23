import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  photoDataOptions,
  updatePhotoCount,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";
import { Square, Rows2, LayoutPanelTop, LayoutGrid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { value: "1", label: "1 Image", icon: <Square size={16} /> },
  { value: "2", label: "2 Images", icon: <Rows2 size={16} /> },
  { value: "3", label: "3 Images", icon: <LayoutPanelTop size={16} /> },
  { value: "4", label: "4 Images", icon: <LayoutGrid size={16} /> },
];

export const PhotoLayoutSelector: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: photoData } = useQuery(photoDataOptions);

  const updatePhotoCountMutation = useMutation({
    mutationFn: (newCount: number) => {
      if (!photoData) throw new Error("Photo data not available");
      return updatePhotoCount(newCount, photoData);
    },
    onSuccess: (newPhotoData) => {
      queryClient.setQueryData(photoDataOptions.queryKey, newPhotoData);
    },
  });

  if (!photoData) return null;

  const handleValueChange = (value: string) => {
    updatePhotoCountMutation.mutate(parseInt(value));
  };

  return (
    <Select
      value={photoData.photoCount.toString()}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select layout" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center">
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
