import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useSearchParams } from 'next/navigation';

const FinanceAmountSection = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const textProps = textAlgorithm('netIncome');

  // Get draft finance data with useQuery for real-time updates
  const { data: draftFinanceData } = useQuery({
    queryKey: ['draftFinance', selectedListingId, selectedDocumentType],
  });

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  // Format finance amount with commas
  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '$0';
    return '$' + numAmount.toLocaleString();
  };

  // Determine finance type label
  const getFinanceTypeLabel = () => {
    if (!draftFinanceData?.financeType) return 'Net Income';

    switch (draftFinanceData.financeType) {
      case 'rent':
        return 'Rent';
      case 'net_income':
        return 'Net Income';
      case 'custom':
        return draftFinanceData.customFinanceType || 'Custom';
      default:
        return 'Net Income';
    }
  };

  // Get formatted finance amount
  const getFormattedAmount = () => {
    if (!draftFinanceData?.financeAmount) return '$0';
    return formatAmount(draftFinanceData.financeAmount);
  };

  return (
    <div
      className={`absolute bottom-[5.8%] left-[4.75%] flex h-[5%] w-[30%] flex-col items-end justify-end
        group cursor-pointer group-hover/finance:scale-[1.01] transition-all duration-300 z-10`}
      onClick={() => {
        updateSelectedSection('Finance' as SectionName);
      }}
    >
      <p
        className={`${textProps.getTailwind()} w-full group-hover/finance:text-warning-foreground`}
        style={textProps.getStyle()}
      >
        {`${getFinanceTypeLabel()}: ${getFormattedAmount()} pa* + GST`}
      </p>
    </div>
  );
};

export default FinanceAmountSection;
