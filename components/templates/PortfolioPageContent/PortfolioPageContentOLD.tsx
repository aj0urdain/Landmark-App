"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import PortfolioPageViewer from "@/components/templates/PortfolioPageViewer/PortfolioPageViewer";
import { Card } from "@/components/ui/card";
import PortfolioPageControls from "@/components/organisms/PortfolioPageControls/PortfolioPageControls";
import PreviewControls from "@/components/organisms/PortfolioPageControls/PreviewControls/PreviewControls";
import { documentSetupOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queriesOLD";

const PortfolioPageContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPropertyId = searchParams.get("property");

  const { data: documentSetup } = useQuery(
    documentSetupOptions(selectedPropertyId),
  );

  const { data: previewSettings } = useQuery({
    queryKey: ["previewSettings"],
    queryFn: () => ({
      zoom: 1,
      overlayOpacity: 0.5,
      showOverlay: false,
      pageSide: "left" as "left" | "right",
    }),
  });

  React.useEffect(() => {
    if (documentSetup) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("document", documentSetup.documentId?.toString() || "");
      newParams.set("version", documentSetup.versionNumber?.toString() || "");
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [documentSetup, pathname, router, searchParams]);

  if (!previewSettings) return null;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        <PortfolioPageControls
          isDisabled={!selectedPropertyId}
          canEdit={documentSetup?.canEdit || false}
        />
        <div className="relative z-10 flex h-full w-[55%] flex-col gap-4">
          <PreviewControls isDisabled={!selectedPropertyId} />
          <Card className="flex h-full overflow-hidden">
            <PortfolioPageViewer selectedPropertyId={selectedPropertyId} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageContent;
