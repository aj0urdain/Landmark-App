"use client";

import React, { useEffect, useState } from "react";
import PortfolioPageViewer from "@/components/templates/PortfolioPageViewer/PortfolioPageViewer";
import { Card } from "@/components/ui/card";
import PortfolioPageControls from "@/components/organisms/PortfolioPageControls/PortfolioPageControls";
import PreviewControls from "@/components/organisms/PortfolioPageControls/PreviewControls/PreviewControls";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/utils/supabase/client";

const PortfolioPage = () => {
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [versionNumber, setVersionNumber] = useState<number | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPropertyId = searchParams.get("property");

  useEffect(() => {
    const handleDocumentSetup = async () => {
      if (!selectedPropertyId) return;

      if (selectedPropertyId === "sandbox") {
        setCanEdit(true);
        setDocumentId(null);
        setVersionNumber(null);
        return;
      }

      const supabase = createBrowserClient();

      // Get current user's ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      // Check if the user is authorized for this property
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("lead_agent, associated_agents")
        .eq("id", selectedPropertyId)
        .single();

      if (propertyError) {
        console.error("Error fetching property data:", propertyError);
        return;
      }

      const isAuthorized =
        propertyData.lead_agent === user.id ||
        (propertyData.associated_agents &&
          propertyData.associated_agents.includes(user.id));

      setCanEdit(isAuthorized);

      // Check if document exists
      const { data: existingDocument, error: fetchError } = await supabase
        .from("documents")
        .select("id")
        .eq("property_id", selectedPropertyId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching document:", fetchError);
        return;
      }

      let docId: number;

      if (!existingDocument) {
        if (!isAuthorized) {
          console.log("User is not authorized to create a new document");
          return;
        }
        // Create new document
        const { data: newDocument, error: insertError } = await supabase
          .from("documents")
          .insert({
            property_id: selectedPropertyId,
            document_type_id: 1, // Assuming 1 is for portfolio documents
            document_owner: user.id,
            document_data: {}, // Initialize with empty data
            status_id: 1, // Assuming 1 is for 'draft' status
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Error creating document:", insertError);
          return;
        }

        docId = newDocument.id;

        // Create first history entry
        const { error: historyError } = await supabase
          .from("document_history")
          .insert({
            document_id: docId,
            edited_by: user.id,
            version_number: 1,
            document_snapshot: {}, // Initialize with empty data
            status_id: 1, // Assuming 1 is for 'draft' status
            change_summary: "Initial document creation",
          });

        if (historyError) {
          console.error("Error creating document history:", historyError);
          return;
        }
      } else {
        docId = existingDocument.id;
      }

      // Fetch latest version number
      const { data: latestVersion, error: versionError } = await supabase
        .from("document_history")
        .select("version_number")
        .eq("document_id", docId)
        .order("version_number", { ascending: false })
        .limit(1)
        .single();

      if (versionError) {
        console.error("Error fetching latest version:", versionError);
        return;
      }

      setDocumentId(docId);
      console.log("Document ID:", documentId);
      setVersionNumber(latestVersion.version_number);
      console.log("Version Number:", versionNumber);

      // Update URL with document ID and version number while preserving property ID
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("document", docId.toString());
      newParams.set("version", latestVersion.version_number.toString());
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    };

    handleDocumentSetup();
  }, [
    selectedPropertyId,
    pathname,
    router,
    searchParams,
    documentId,
    versionNumber,
  ]);

  const { data: previewSettings } = useQuery({
    queryKey: ["previewSettings"],
    queryFn: () => ({
      zoom: 1,
      overlayOpacity: 0.5,
      showOverlay: false,
      pageSide: "left" as "left" | "right",
    }),
  });

  if (!previewSettings) return null;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        <PortfolioPageControls
          isDisabled={!selectedPropertyId}
          canEdit={canEdit}
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

export default PortfolioPage;
