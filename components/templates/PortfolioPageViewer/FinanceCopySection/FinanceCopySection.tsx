import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useSearchParams } from 'next/navigation';

const FinanceCopySection = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const textProps = textAlgorithm('financeCopy');

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

  // Parse the finance copy string into an array of lines
  const financeLines = draftFinanceData?.financeCopy
    ? draftFinanceData.financeCopy.split('\n').filter((line) => line.trim() !== '')
    : [];

  // If there are no finance lines, create placeholder blocks
  const displayLines =
    financeLines.length > 0
      ? financeLines
      : [
          'Place your finance copy here',
          'Each line break will be treated as a separate block',
          'Click to edit!',
        ];

  return (
    <div
      className={`absolute left-[4.75%] top-[83%] flex h-[8.5%] w-[30.5%] flex-col 
        items-start justify-start gap-[11%] font-medium 
        group cursor-pointer group-hover/finance:scale-[1.01] transition-all duration-300 z-10`}
      onClick={() => {
        updateSelectedSection('Finance' as SectionName);
      }}
    >
      {displayLines.map((line, index) => (
        <p
          key={index}
          className={`${textProps.getTailwind()} w-full ${
            financeLines.length === 0 ? 'text-gray-400' : ''
          } group-hover/finance:text-warning-foreground`}
          style={textProps.getStyle()}
        >
          {line}
        </p>
      ))}
    </div>
  );
};

export default FinanceCopySection;
