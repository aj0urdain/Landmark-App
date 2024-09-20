"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import LocationTab from "./LocationTab/LocationTab";
import PhotoRender from "./PhotoRender/PhotoRender";
import PhotoRenderB from "./PhotoRender/PhotoRenderB";
import PhotoRenderC from "./PhotoRender/PhotoRenderC";
import HeadlineSection from "./HeadlineSection/HeadlineSection";
import AddressSection from "./AddressSection/AddressSection";
import FinanceCopySection from "./FinanceCopySection/FinanceCopySection";
import FinanceAmountSection from "./FinanceAmountSection/FinanceAmountSection";
import BottomPageBorder from "./BottomPageBorder/BottomPageBorder";
import PropertyCopySection from "./PropertyCopySection/PropertyCopySection";
import ContactSection from "./ContactSection/ContactSection";

const A4_ASPECT_RATIO = 297 / 210; // height / width

const PortfolioPageViewer = () => {
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

          <PhotoRender />

          <PhotoRenderB />

          <PhotoRenderC />

          <HeadlineSection />

          <AddressSection />

          <FinanceCopySection />

          <FinanceAmountSection />

          <PropertyCopySection />

          <ContactSection />

          <BottomPageBorder />

          {/* <div
            className="absolute bottom-[15%] left-[10%]"
            style={{
              fontSize: `${14 * scale * (previewSettings?.zoom ?? 1)}px`,
              width: `${150 * scale * (previewSettings?.zoom ?? 1)}px`,
            }}
          >
            This is a longer paragraph of text that will wrap based on the
            scaled width.
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageViewer;
