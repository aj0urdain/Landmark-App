import { useQuery, useQueryClient } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { documentDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";
import { getStateConfig } from "@/lib/stateConfigs";

const LocationTab = () => {
  const queryClient = useQueryClient();

  const previewSettings = queryClient.getQueryData(["previewSettings"]) as
    | { zoom: number; pageSide?: "left" | "right" }
    | undefined;

  const documentId = queryClient.getQueryData(["currentDocumentId"]) as
    | number
    | undefined;

  const { data: documentData } = useQuery(
    documentDataOptions(documentId ?? null),
  );

  const pageSide = previewSettings?.pageSide ?? "right";

  const textProps = textAlgorithm("locationTab", queryClient);

  const { tabName, tabColor, textColor } = getStateConfig(
    documentData?.addressData.state || "",
  );

  const hasState = !!documentData?.addressData.state;

  return (
    <div
      className={`absolute ${
        pageSide === "right"
          ? "right-[0%] items-end justify-end rounded-bl-xl pr-[4.75%]"
          : "left-[0%] items-end justify-start rounded-br-xl pl-[4.75%]"
      } top-[0%] flex h-[4.5%] w-[28.5%] pb-[1.9%] font-extrabold`}
      style={{
        backgroundColor: hasState ? tabColor : "#E5E7EB", // Use a muted gray if no state
        width: documentData?.addressData.state === "ACT" ? "34.65%" : "28.5%",
      }}
    >
      <span
        className={`${textProps.getTailwind()} uppercase tracking-widest`}
        style={{
          ...textProps.getStyle(),
          color: hasState ? textColor : "#9CA3AF", // Use a muted text color if no state
        }}
      >
        {hasState ? tabName : "No State"}
      </span>
    </div>
  );
};

export default LocationTab;
