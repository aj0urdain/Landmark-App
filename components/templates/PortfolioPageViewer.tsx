"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";

const A4_ASPECT_RATIO = 297 / 210; // height / width

const PortfolioPageViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { data: previewSettings } = useQuery({
    queryKey: ["previewSettings"],
    queryFn: () => ({
      zoom: 0.9,
      overlayOpacity: 0.5,
      showOverlay: true,
      pageSide: "left" as "left" | "right",
    }),
  });

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

  return (
    // <div className="flex h-full w-full flex-col items-center justify-center p-4">
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden bg-white text-slate-950 shadow-lg"
        style={{
          width: `${210 * scale * (previewSettings?.zoom ?? 1)}px`,
          height: `${297 * scale * (previewSettings?.zoom ?? 1)}px`,
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
              width: `${210 * scale * previewSettings?.zoom}px`,
              height: `${297 * scale * previewSettings?.zoom}px`,
            }}
          />
        )}
        {/* A4 content */}
        <div className="absolute left-[5%] top-[5%] flex h-[20%] w-[40%] items-center justify-center bg-blue-200">
          <span
            style={{
              fontSize: `${12 * scale * (previewSettings?.zoom ?? 1)}px`,
            }}
          >
            Top Left Text
          </span>
        </div>
        <div className="absolute bottom-[5%] right-[5%] flex h-[20%] w-[40%] items-center justify-center bg-green-200">
          <span
            style={{
              fontSize: `${16 * scale * (previewSettings?.zoom ?? 1)}px`,
            }}
          >
            Bottom Right Text
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[50%] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-red-200">
          <span
            style={{
              fontSize: `${20 * scale * (previewSettings?.zoom ?? 1)}px`,
            }}
          >
            Center Text
          </span>
        </div>
        <div
          className="absolute right-[10%] top-[10%] rotate-45 transform"
          style={{ fontSize: `${24 * scale * (previewSettings?.zoom ?? 1)}px` }}
        >
          Rotated Text
        </div>
        <div
          className="absolute bottom-[15%] left-[10%]"
          style={{
            fontSize: `${14 * scale * (previewSettings?.zoom ?? 1)}px`,
            width: `${150 * scale * (previewSettings?.zoom ?? 1)}px`,
          }}
        >
          This is a longer paragraph of text that will wrap based on the scaled
          width.
        </div>
      </div>
    </div>
    // </div>
  );
};

export default PortfolioPageViewer;
