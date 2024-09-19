"use client";

import React, { useState, useRef, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

const A4_ASPECT_RATIO = 297 / 210; // height / width

const ScaleChecker = () => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

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
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-center space-x-2">
        <button
          onClick={handleZoomOut}
          className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          <Minus size={20} />
        </button>
        <span className="rounded bg-gray-200 px-2 py-1">
          {(zoom * 100).toFixed(0)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          <Plus size={20} />
        </button>
      </div>
      <div
        ref={containerRef}
        className="relative h-[calc(100vh-8rem)] w-full overflow-hidden bg-gray-100"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden bg-white text-slate-950 shadow-lg"
          style={{
            width: `${210 * scale * zoom}px`,
            height: `${297 * scale * zoom}px`,
          }}
        >
          {/* A4 content */}
          <div className="absolute left-[5%] top-[5%] flex h-[20%] w-[40%] items-center justify-center bg-blue-200">
            <span style={{ fontSize: `${12 * scale * zoom}px` }}>
              Top Left Text
            </span>
          </div>
          <div className="absolute bottom-[5%] right-[5%] flex h-[20%] w-[40%] items-center justify-center bg-green-200">
            <span style={{ fontSize: `${16 * scale * zoom}px` }}>
              Bottom Right Text
            </span>
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[50%] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-red-200">
            <span style={{ fontSize: `${20 * scale * zoom}px` }}>
              Center Text
            </span>
          </div>
          <div
            className="absolute right-[10%] top-[10%] rotate-45 transform"
            style={{ fontSize: `${24 * scale * zoom}px` }}
          >
            Rotated Text
          </div>
          <div
            className="absolute bottom-[15%] left-[10%]"
            style={{
              fontSize: `${14 * scale * zoom}px`,
              width: `${150 * scale * zoom}px`,
            }}
          >
            This is a longer paragraph of text that will wrap based on the
            scaled width.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleChecker;
