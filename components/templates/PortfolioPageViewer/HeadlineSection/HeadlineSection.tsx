import { useQuery, useQueryClient } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { documentDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const HeadlineSection = () => {
  const queryClient = useQueryClient();
  const documentId = queryClient.getQueryData(["currentDocumentId"]) as
    | number
    | undefined;
  const { data: documentData } = useQuery(
    documentDataOptions(documentId ?? null),
  );

  const textProps = textAlgorithm("headline", queryClient);

  if (!documentData) return null;

  const { headlineData, logoData } = documentData;

  const getHeadlineWidth = () => {
    if (!logoData || logoData.logoCount === 0) return "90.5%";
    if (logoData.logoCount === 1) return "76.5%";
    return "62.5%";
  };

  const headlineWidth = getHeadlineWidth();

  return (
    <div
      className={`absolute left-[4.75%] top-[68%] flex h-[5.5%] font-medium`}
      style={{ width: headlineWidth }}
    >
      <span className={textProps.getTailwind()} style={textProps.getStyle()}>
        {headlineData.headline ||
          "Insert the Headline for your property here! Make it good!"}
      </span>
    </div>
  );
};

export default HeadlineSection;
