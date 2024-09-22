import { useQueryClient } from "@tanstack/react-query";

export const borderRadiusAlgorithm = (
  baseRadius: number,
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  const previewSettings = queryClient.getQueryData(["previewSettings"]) as
    | { zoom: number; scale: number }
    | undefined;
  const zoom = previewSettings?.zoom ?? 1;
  const scale = previewSettings?.scale ?? 1;

  const scaledRadius = baseRadius * scale * zoom;

  return {
    getBorderRadius: () => `${scaledRadius}px`,
  };
};
