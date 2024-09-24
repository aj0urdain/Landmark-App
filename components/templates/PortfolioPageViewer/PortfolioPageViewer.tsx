"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useEffect } from "react";
import LocationTab from "./LocationTab/LocationTab";
import HeadlineSection from "./HeadlineSection/HeadlineSection";
import AddressSection from "./AddressSection/AddressSection";
import FinanceCopySection from "./FinanceCopySection/FinanceCopySection";
import FinanceAmountSection from "./FinanceAmountSection/FinanceAmountSection";
import BottomPageBorder from "./BottomPageBorder/BottomPageBorder";
import PropertyCopySection from "./PropertyCopySection/PropertyCopySection";
import ContactSection from "./ContactSection/ContactSection";

import LogoSection from "./LogoSection/LogoSection";
import PhotoRender from "./PhotoRender/PhotoRender";

const A4_ASPECT_RATIO = 297 / 210; // height / width

interface PortfolioPageViewerProps {
  selectedPropertyId: string | null;
  renderEmpty: boolean;
  renderError: boolean;
  isLoading: boolean;
  key: number;
}

const PortfolioPageViewer: React.FC<PortfolioPageViewerProps> = ({
  selectedPropertyId,
  renderEmpty,
  renderError,
  isLoading,
  key,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: previewSettings } = useQuery({
    queryKey: ["previewSettings"],
  }) as {
    data:
      | {
          zoom: number;
          scale: number;
          overlayOpacity: number;
          showOverlay: boolean;
          pageSide: "left" | "right";
        }
      | undefined;
  };

  const updateScale = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const containerAspectRatio = containerHeight / containerWidth;

      let newScale;
      if (containerAspectRatio > A4_ASPECT_RATIO) {
        newScale = containerWidth / 210;
      } else {
        newScale = containerHeight / 297;
      }

      queryClient.setQueryData(
        ["previewSettings"],
        (oldData: typeof previewSettings) => ({
          ...oldData,
          scale: newScale,
        }),
      );
    }
  };

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    if (containerRef.current && previewSettings?.zoom) {
      const container = containerRef.current;
      const prevZoom = previewSettings.zoom;
      const newZoom = previewSettings.zoom;

      // Calculate the center point
      const centerX = container.scrollLeft + container.clientWidth / 2;
      const centerY = container.scrollTop + container.clientHeight / 2;

      // Adjust the scroll position
      container.scrollLeft =
        (centerX * newZoom) / prevZoom - container.clientWidth / 2;
      container.scrollTop =
        (centerY * newZoom) / prevZoom - container.clientHeight / 2;
    }
  }, [previewSettings?.zoom]);

  if (!selectedPropertyId || renderEmpty || isLoading) {
    return (
      <div
        ref={containerRef}
        className="relative flex h-full w-full items-center justify-center overflow-auto"
      >
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-transparent text-gray-500"
          style={{
            width: `${210 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
            height: `${297 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
          }}
        >
          {renderError && <p>Error loading property data</p>}
          {renderEmpty && (
            <p>Select a property or sandbox mode to get started</p>
          )}
          {isLoading && <p>Loading...</p>}
          {!selectedPropertyId &&
            !isLoading &&
            !renderError &&
            !renderEmpty && (
              <p className="animate-pulse text-lg text-foreground">
                Select a property or sandbox mode to get started!
              </p>
            )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      key={key}
      className="relative h-full w-full overflow-auto"
    >
      <div
        className="relative"
        style={{
          width: `${210 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
          height: `${297 * (previewSettings?.scale ?? 1) * (previewSettings?.zoom ?? 1)}px`,
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

          <LocationTab />

          <PhotoRender />

          <HeadlineSection />

          <LogoSection />

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
