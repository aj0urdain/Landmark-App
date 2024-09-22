"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import LocationTab from "./LocationTab/LocationTab";
import HeadlineSection from "./HeadlineSection/HeadlineSection";
import AddressSection from "./AddressSection/AddressSection";
import FinanceCopySection from "./FinanceCopySection/FinanceCopySection";
import FinanceAmountSection from "./FinanceAmountSection/FinanceAmountSection";
import BottomPageBorder from "./BottomPageBorder/BottomPageBorder";
import PropertyCopySection from "./PropertyCopySection/PropertyCopySection";
import ContactSection from "./ContactSection/ContactSection";
import PhotoRenderNEW from "./PhotoRender/PhotoRenderNEW";

const A4_ASPECT_RATIO = 297 / 210; // height / width

interface PortfolioPageViewerProps {
  selectedPropertyId: string | null;
}

const PortfolioPageViewer: React.FC<PortfolioPageViewerProps> = ({
  selectedPropertyId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const queryClient = useQueryClient();

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

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const containerAspectRatio = containerHeight / containerWidth;

        if (containerAspectRatio > A4_ASPECT_RATIO) {
          setScale(containerWidth / 210);
        } else {
          setScale(containerHeight / 297);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    if (containerRef.current && previewSettings?.zoom) {
      const container = containerRef.current;
      const prevZoom = zoom;
      const newZoom = previewSettings.zoom;

      // Calculate the center point
      const centerX = container.scrollLeft + container.clientWidth / 2;
      const centerY = container.scrollTop + container.clientHeight / 2;

      // Adjust the scroll position
      container.scrollLeft =
        (centerX * newZoom) / prevZoom - container.clientWidth / 2;
      container.scrollTop =
        (centerY * newZoom) / prevZoom - container.clientHeight / 2;

      setZoom(newZoom);
    }
  }, [previewSettings?.zoom, zoom]);

  useEffect(() => {
    // Update previewSettings with both zoom and scale
    queryClient.setQueryData(
      ["previewSettings"],
      (oldData: typeof previewSettings) => ({
        ...oldData,
        zoom: previewSettings?.zoom ?? 1,
        scale: scale,
      }),
    );
  }, [queryClient, previewSettings?.zoom, scale]);

  if (!selectedPropertyId) {
    return (
      <div
        ref={containerRef}
        className="relative flex h-full w-full items-center justify-center overflow-auto"
      >
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-transparent text-gray-500"
          style={{
            width: `${210 * scale}px`,
            height: `${297 * scale}px`,
          }}
        >
          Select a property or sandbox mode to get started
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-auto">
      <div
        className="relative"
        style={{
          width: `${210 * scale * zoom}px`,
          height: `${297 * scale * zoom}px`,
          margin: "auto",
        }}
      >
        <div
          className="bg-white text-slate-950 shadow-lg"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {previewSettings?.showOverlay && (
            <div
              className="absolute z-20 h-full w-full"
              style={{
                backgroundImage: `url('/images/portfolio-reference.png')`,
                opacity: previewSettings.overlayOpacity,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          {/* A4 content */}
          {/* State Tab */}
          <LocationTab />
          {/* 
          <PhotoRender />

          <PhotoRenderB />

          <PhotoRenderC /> */}

          <PhotoRenderNEW />

          <HeadlineSection />

          <AddressSection />

          <FinanceCopySection />

          <FinanceAmountSection />

          <PropertyCopySection />

          <ContactSection />

          <BottomPageBorder />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageViewer;
