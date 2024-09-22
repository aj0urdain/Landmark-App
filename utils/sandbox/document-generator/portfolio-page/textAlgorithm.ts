import { useQueryClient } from "@tanstack/react-query";

export const textProperties = {
  locationTab: {
    fontSize: 2.75,
    fontColor: "white",
    fontWeight: 600,
    fontFamily: "metro",
    extraClass: "uppercase tracking-widest",
    leading: null,
  },
  headline: {
    fontSize: 8.05,
    fontColor: "portfolio-headline",
    fontWeight: 500,
    fontFamily: "lexia",
    extraClass: "",
    leading: 8,
  },
  address: {
    fontSize: 4.25,
    fontColor: "portfolio-address",
    fontWeight: 500,
    fontFamily: "lexia",
    extraClass: "",
    leading: null,
  },
  financeCopy: {
    fontSize: 4.2,
    fontColor: "portfolio-financeCopy",
    fontWeight: 500,
    fontFamily: "lexia",
    extraClass: "leading-[12.5px]",
    leading: 5,
  },
  netIncome: {
    fontSize: 3.9,
    fontColor: "portfolio-financeCopy",
    fontWeight: 800,
    fontFamily: "lexia",
    extraClass: "",
    leading: 4,
  },
  propertyCopyBullet: {
    fontSize: 3.75,
    fontColor: "portfolio-propertyCopy",
    fontWeight: 500,
    fontFamily: "lexia",
    extraClass: "",
    leading: 4,
  },
  propertyCopy: {
    fontSize: 3.75,
    fontColor: "portfolio-propertyCopy",
    fontWeight: 500,
    fontFamily: "lexia",
    extraClass: "",
    leading: 4,
  },
  contactHeader: {
    fontSize: 3.25,
    fontColor: "portfolio-contactHeader",
    fontWeight: null,
    fontFamily: "metro",
    extraClass: "",
    leading: 3,
  },
  agents: {
    fontSize: 3.25,
    fontColor: "portfolio-agents",
    fontWeight: 400,
    fontFamily: "metro",
    extraClass: "",
    leading: null,
  },
  saleType: {
    fontSize: 7.25,
    fontColor: "portfolio-saleType",
    fontWeight: 700,
    fontFamily: "metro",
    extraClass: "",
    leading: 10,
  },
  footNote: {
    fontSize: 2.45,
    fontColor: "portfolio-saleType",
    fontWeight: 400,
    fontFamily: "metro",
    extraClass: "",
    leading: 3.5,
  },
};

export const textAlgorithm = (
  type: keyof typeof textProperties,
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  const { fontSize, fontColor, fontWeight, fontFamily, extraClass, leading } =
    textProperties[type];
  const previewSettings = queryClient.getQueryData(["previewSettings"]) as
    | { zoom: number; scale: number }
    | undefined;
  const zoom = previewSettings?.zoom ?? 1;
  const scale = previewSettings?.scale ?? 1;

  const scaledFontSize = fontSize * scale * zoom;
  const scaledLeading = leading ? leading * scale * zoom : undefined;

  return {
    getTailwind: () =>
      `text-${fontColor} font-${fontFamily} ${extraClass}`.trim(),
    getStyle: () => ({
      fontSize: `${scaledFontSize}px`,
      ...(scaledLeading && { lineHeight: `${scaledLeading}px` }),
      ...(fontWeight && { fontWeight }), // Include fontWeight in the style object
    }),
  };
};
