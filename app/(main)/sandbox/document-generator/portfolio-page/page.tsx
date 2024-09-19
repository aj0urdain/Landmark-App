"use client";

import React from "react";
import PortfolioPageViewer from "@/components/templates/PortfolioPageViewer";
import { Card } from "@/components/ui/card";
import PortfolioPageControls from "@/components/organisms/PortfolioPageControls/PortfolioPageControls";
import PreviewControls from "@/components/organisms/PortfolioPageControls/PreviewControls/PreviewControls";
import { useQuery } from "@tanstack/react-query";

const PortfolioPage = () => {
  const { data: previewSettings } = useQuery({
    queryKey: ["previewSettings"],
    queryFn: () => ({
      zoom: 0.9,
      overlayOpacity: 0.5,
      showOverlay: true,
      pageSide: "left" as "left" | "right",
    }),
  });

  if (!previewSettings) return null;

  return (
    <div className="mx-4 flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4 py-4 2xl:mx-auto">
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        <PortfolioPageControls />
        <div className="relative z-10 flex h-full w-[55%] flex-col gap-4">
          <PreviewControls />
          <Card className="flex h-full">
            <PortfolioPageViewer />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
