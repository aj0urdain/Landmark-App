"use client";

import React, { useEffect, useState } from "react";
import PortfolioPageViewer from "@/components/templates/PortfolioPageViewer/PortfolioPageViewer";
import { Card } from "@/components/ui/card";
import PortfolioPageControls from "@/components/organisms/PortfolioPageControls/PortfolioPageControls";
import PreviewControls from "@/components/organisms/PortfolioPageControls/PreviewControls/PreviewControls";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDocumentSetup } from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";

const PortfolioPageContent = () => {
  const [canEdit, setCanEdit] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPropertyId = searchParams.get("property") || null;

  const { data, isLoading, isError } = useDocumentSetup(selectedPropertyId);

  const { data: previewSettings } = useQuery({
    queryKey: ["previewSettings"],
    queryFn: () => ({
      zoom: 1,
      overlayOpacity: 0.5,
      showOverlay: false,
      pageSide: "right" as "right" | "left",
    }),
  });

  useEffect(() => {
    if (data) {
      const { docId, versionNumber, canEdit } = data;

      setCanEdit(canEdit);

      // Update URL with document ID and version number while preserving property ID
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("document", docId.toString());
      newParams.set("version", versionNumber.toString());
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [data, searchParams, router, pathname]);

  if (!previewSettings) return null;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        <PortfolioPageControls
          isDisabled={!selectedPropertyId || isLoading}
          canEdit={canEdit}
          renderError={isError}
          isLoading={isLoading}
        />
        <div className="relative z-10 flex h-full w-[55%] flex-col gap-4">
          <PreviewControls isDisabled={!selectedPropertyId} />
          <Card className="flex h-full overflow-hidden">
            <PortfolioPageViewer
              isLoading={isLoading}
              renderEmpty={isLoading}
              renderError={isError}
              selectedPropertyId={selectedPropertyId}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageContent;
