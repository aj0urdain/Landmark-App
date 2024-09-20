import { useQueryClient } from "@tanstack/react-query";

const PhotoRenderC = () => {
  const queryClient = useQueryClient();

  const previewSettings = queryClient.getQueryData(["previewSettings"]) as
    | { zoom: number; pageSide?: "left" | "right" }
    | undefined;

  const pageSide = previewSettings?.pageSide ?? "right";

  return (
    <div
      className={`absolute ${
        pageSide === "right"
          ? "items-end justify-end rounded-bl-xl pr-[4.75%]"
          : "items-end justify-start rounded-br-xl pl-[4.75%]"
      } right-[4.75%] top-[42.75%] flex h-[23.5%] w-[44.5%] bg-orange-200 pb-[1.9%] font-extrabold`}
    ></div>
  );
};

export default PhotoRenderC;
