import { useQueryClient } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";

const FinanceAmountSection = () => {
  const queryClient = useQueryClient();

  const textProps = textAlgorithm("netIncome", queryClient);

  return (
    <div
      className={`absolute bottom-[5.8%] left-[4.75%] flex h-[5%] w-[30%] flex-col items-end justify-end font-bold`}
    >
      <p
        className={`${textProps.getTailwind()} w-full`}
        style={textProps.getStyle()}
      >
        Net Income: $460,375 pa* + GST
      </p>
      {/* <p
        className={`${textProps.getTailwind()} w-full`}
        style={textProps.getStyle()}
      >
        This is a newline
      </p> */}
    </div>
  );
};

export default FinanceAmountSection;
