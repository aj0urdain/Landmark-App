"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Settings, RotateCcw, ArrowLeftRight } from "lucide-react";

const PreviewControls = () => {
  const queryClient = useQueryClient();
  const [slidersOpen, setSlidersOpen] = useState(false);

  const { data: previewSettings } = useQuery({
    queryKey: ["previewSettings"],
  }) as {
    data:
      | {
          zoom: number;
          overlayOpacity: number;
          showOverlay: boolean;
          pageSide: "left" | "right";
        }
      | undefined;
  };

  const updateSettings = useMutation({
    mutationFn: (newSettings: Partial<typeof previewSettings>) => {
      // This would be an API call in a real app
      return Promise.resolve({ ...previewSettings, ...newSettings });
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(["previewSettings"], newSettings);
    },
  });

  const handleZoomIn = () =>
    updateSettings.mutate({
      zoom: Math.min((previewSettings?.zoom || 0) + 0.1, 2),
    });
  const handleZoomOut = () =>
    updateSettings.mutate({
      zoom: Math.max((previewSettings?.zoom || 0) - 0.1, 0.5),
    });
  const handleResetZoom = () => updateSettings.mutate({ zoom: 1 });
  const handleToggleOverlay = () =>
    updateSettings.mutate({ showOverlay: !previewSettings?.showOverlay });
  const handleTogglePageSide = () =>
    updateSettings.mutate({
      pageSide: previewSettings?.pageSide === "left" ? "right" : "left",
    });

  if (!previewSettings) return null;

  return (
    <Card className="flex items-center justify-between space-x-2 p-2">
      <div className="flex items-center space-x-2">
        <Button onClick={handleZoomOut} size="icon" variant="outline">
          <Minus size={20} />
        </Button>
        <span className="w-16 text-center">
          {(previewSettings.zoom * 100).toFixed(0)}%
        </span>
        <Button onClick={handleZoomIn} size="icon" variant="outline">
          <Plus size={20} />
        </Button>
        <Button onClick={handleResetZoom} size="icon" variant="outline">
          <RotateCcw size={20} />
        </Button>
      </div>

      <Popover open={slidersOpen} onOpenChange={setSlidersOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Overlay Opacity</label>
              <Slider
                value={[previewSettings.overlayOpacity * 100]}
                max={100}
                step={1}
                onValueChange={(value) =>
                  updateSettings.mutate({ overlayOpacity: value[0] / 100 })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Show Overlay</span>
              <Switch
                checked={previewSettings.showOverlay}
                onCheckedChange={handleToggleOverlay}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button onClick={handleTogglePageSide} variant="outline">
        <ArrowLeftRight size={20} className="mr-2" />
        {previewSettings.pageSide === "left" ? "Left" : "Right"} Side
      </Button>
    </Card>
  );
};

export default PreviewControls;
