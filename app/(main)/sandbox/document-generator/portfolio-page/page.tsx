"use client";

import React, { useState } from "react";
import PortfolioPageViewer from "@/components/templates/PortfolioPageViewer";
import { Card } from "@/components/ui/card";
import PortfolioPageControls from "@/components/organisms/PortfolioPageControls/PortfolioPageControls";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const PortfolioPage = () => {
  const [zoom, setZoom] = useState(0.9);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  const PreviewControls = ({
    zoom,
    setOverlayOpacity,
    handleZoomIn,
    handleZoomOut,
  }: {
    zoom: number;
    setOverlayOpacity: (opacity: number) => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
  }) => {
    return (
      <Card className="flex flex-col gap-4 p-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Overlay Opacity</h3>
          <Slider
            defaultValue={[50]}
            max={100}
            min={0}
            step={1}
            onValueChange={(value) => setOverlayOpacity(value[0] / 100)}
          />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Zoom Controls</h3>
          <div className="flex space-x-2">
            <Button onClick={handleZoomOut} size="icon" variant="outline">
              <Minus size={20} />
            </Button>
            <span className="flex items-center rounded bg-gray-200 px-2">
              {(zoom * 100).toFixed(0)}%
            </span>
            <Button onClick={handleZoomIn} size="icon" variant="outline">
              <Plus size={20} />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="mx-4 flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4 py-4 2xl:mx-auto">
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        <PortfolioPageControls />
        <div className="relative z-10 flex h-full w-[55%] flex-col gap-4">
          <PreviewControls
            zoom={zoom}
            setOverlayOpacity={setOverlayOpacity}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
          />
          <Card className="flex h-full">
            <PortfolioPageViewer
              content="Hello"
              zoom={zoom}
              overlayOpacity={overlayOpacity}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
