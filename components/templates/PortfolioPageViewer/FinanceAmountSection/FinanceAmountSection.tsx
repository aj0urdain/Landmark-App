import { useQuery, useQueryClient } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { financeDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const FinanceAmountSection = () => {
  const queryClient = useQueryClient();

  const { data: financeData } = useQuery(financeDataOptions);

  const textProps = textAlgorithm("netIncome", queryClient);

  // Format finance amount with commas
  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "$0";
    return "$" + numAmount.toLocaleString();
  };

  // Determine finance type label
  const getFinanceTypeLabel = () => {
    if (!financeData) return "Net Income";

    switch (financeData.financeType) {
      case "rent":
        return "Rent";
      case "net_income":
        return "Net Income";
      case "custom":
        return financeData.customFinanceType || "Custom";
      default:
        return "Net Income";
    }
  };

  // Get formatted finance amount
  const getFormattedAmount = () => {
    if (!financeData || !financeData.financeAmount) return "$999,999";
    return formatAmount(financeData.financeAmount);
  };

  return (
    <div
      className={`absolute bottom-[5.8%] left-[4.75%] flex h-[5%] w-[30%] flex-col items-end justify-end`}
    >
      <p
        className={`${textProps.getTailwind()} w-full`}
        style={textProps.getStyle()}
      >
        {`${getFinanceTypeLabel()}: ${getFormattedAmount()} pa* + GST`}
      </p>
    </div>
  );
};

export default FinanceAmountSection;
