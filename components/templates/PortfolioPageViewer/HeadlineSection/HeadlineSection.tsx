import { useQueryClient, useQuery } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { headlineDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";

const HeadlineSection = () => {
  const queryClient = useQueryClient();
  const { data: headlineData } = useQuery(headlineDataOptions);

  const textProps = textAlgorithm("headline", queryClient);

  return (
    <div
      className={`absolute left-[4.75%] top-[68%] flex h-[5.5%] w-[62.5%] font-medium`}
    >
      <span className={textProps.getTailwind()} style={textProps.getStyle()}>
        {headlineData?.headline ||
          "Insert the Headline for your property here! Make it good!"}
      </span>
    </div>
  );
};

export default HeadlineSection;
