import { useQueryClient } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";

const LocationTab = () => {
  const queryClient = useQueryClient();

  const previewSettings = queryClient.getQueryData(["previewSettings"]) as
    | { zoom: number; pageSide?: "left" | "right" }
    | undefined;

  const pageSide = previewSettings?.pageSide ?? "right";

  const textProps = textAlgorithm("locationTab", queryClient);

  return (
    <div
      className={`absolute ${
        pageSide === "right"
          ? "right-[0%] items-end justify-end rounded-bl-xl pr-[4.75%]"
          : "left-[0%] items-end justify-start rounded-br-xl pl-[4.75%]"
      } top-[0%] flex h-[4.5%] w-[28.5%] bg-blue-200 pb-[1.9%] font-extrabold`}
    >
      <span className={textProps.getTailwind()} style={textProps.getStyle()}>
        Victoria
      </span>
    </div>
  );
};

export default LocationTab;
