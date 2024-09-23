"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const PortfolioPageContentNEW: React.FC = () => {
  const searchParams = useSearchParams();
  const selectedPropertyId = searchParams.get("property");

  if (!selectedPropertyId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        Selected Property ID: {selectedPropertyId}
      </div>
    </div>
  );
};

export default PortfolioPageContentNEW;
