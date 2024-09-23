import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  logoDataOptions,
  updateLogoCount,
  updateLogoOrientation,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LogoSelectionDialog from "./LogoSelectionDialog/LogoSelectionDialog";

const LogoControls: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: logoData } = useQuery(logoDataOptions);

  const updateLogoCountMutation = useMutation({
    mutationFn: (newCount: number) => {
      if (!logoData) throw new Error("Logo data not available");
      return updateLogoCount(newCount, logoData);
    },
    onSuccess: (newLogoData) => {
      queryClient.setQueryData(logoDataOptions.queryKey, newLogoData);
    },
  });

  const updateLogoOrientationMutation = useMutation({
    mutationFn: (newOrientation: "horizontal" | "vertical") => {
      if (!logoData) throw new Error("Logo data not available");
      return updateLogoOrientation(newOrientation, logoData);
    },
    onSuccess: (newLogoData) => {
      queryClient.setQueryData(logoDataOptions.queryKey, newLogoData);
    },
  });

  if (!logoData) return null;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="w-full space-y-0.5">
          <Label
            htmlFor="number-of-logos"
            className="ml-2 text-xs text-muted-foreground"
          >
            Number of logos
          </Label>
          <Select
            value={logoData.logoCount.toString()}
            onValueChange={(value) =>
              updateLogoCountMutation.mutate(Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Number of logos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Logo</SelectItem>
              {[1, 2].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Logo" : "Logos"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {logoData.logoCount > 0 && (
          <div className="w-full space-y-0.5">
            <Label
              htmlFor="logo-orientation"
              className="ml-2 text-xs text-muted-foreground"
            >
              Logo Orientation
            </Label>
            <Select
              value={logoData.logoOrientation}
              onValueChange={(value: "horizontal" | "vertical") =>
                updateLogoOrientationMutation.mutate(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Logo orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {logoData.logoCount > 0 && (
        <div
          className={`grid gap-4 ${
            logoData.logoOrientation === "horizontal"
              ? "grid-cols-2"
              : "grid-cols-1"
          } rounded-lg border border-slate-800 p-4`}
        >
          {Array.from({ length: logoData.logoCount }).map((_, index) => (
            <LogoSelectionDialog
              key={index}
              index={index}
              logoUrl={logoData.logos[index]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoControls;
