import { useQueryClient } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";

const PhotoRender = () => {
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
          ? "items-end justify-end rounded-bl-xl pr-[4.75%]"
          : "items-end justify-start rounded-br-xl pl-[4.75%]"
      } left-[4.75%] top-[6%] flex h-[35.5%] w-[90.5%] bg-orange-200 pb-[1.9%] font-extrabold`}
    >
      <span className={textProps.getTailwind()} style={textProps.getStyle()}>
        Victoria
      </span>
    </div>
  );
};

export default PhotoRender;
