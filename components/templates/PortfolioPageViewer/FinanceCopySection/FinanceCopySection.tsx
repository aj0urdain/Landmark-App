import { useQueryClient, useQuery } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { financeDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const FinanceCopySection = () => {
  const queryClient = useQueryClient();
  const { data: financeData } = useQuery(financeDataOptions);

  const textProps = textAlgorithm("financeCopy", queryClient);

  // Parse the finance copy string into an array of lines
  const financeLines = financeData?.financeCopy
    ? financeData.financeCopy.split("\n").filter((line) => line.trim() !== "")
    : [];

  // If there are no finance lines, create placeholder blocks
  const displayLines =
    financeLines.length > 0
      ? financeLines
      : [
          "Place your finance copy here",
          "Each line break will be treated as a separate block",
          "Click the dropdown to edit!",
        ];

  return (
    <div
      className={`absolute left-[4.75%] top-[83%] flex h-[8.5%] w-[30.5%] flex-col items-start justify-start gap-[11%] font-medium`}
    >
      {displayLines.map((line, index) => (
        <p
          key={index}
          className={`${textProps.getTailwind()} w-full ${financeLines.length === 0 ? "text-gray-400" : ""}`}
          style={textProps.getStyle()}
        >
          {line}
        </p>
      ))}
    </div>
  );
};

export default FinanceCopySection;
