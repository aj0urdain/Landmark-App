import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import { logoDataOptions } from '@/utils/sandbox/document-generator/portfolio-page/portfolio-queries';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useSearchParams } from 'next/navigation';

const HeadlineSection = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const { data: logoData } = useQuery({
    queryKey: ['draftLogo', selectedListingId, selectedDocumentType],
  });
  const textProps = textAlgorithm('headline');

  const getHeadlineWidth = () => {
    if (!logoData || logoData.logoCount === 0) return '90.5%';
    if (logoData.logoCount === 1) return '76.5%';
    return '62.5%';
  };

  const headlineWidth = getHeadlineWidth();

  const { data: draftHeadline } = useQuery({
    queryKey: ['draftHeadline', selectedListingId, selectedDocumentType],
  });

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  return (
    <div
      className={`absolute left-[4.75%] top-[68%] flex h-[5.5%] font-medium group cursor-pointer hover:scale-[1.01] transition-all duration-300`}
      style={{ width: headlineWidth }}
      onClick={() => {
        updateSelectedSection('Headline' as SectionName);
      }}
    >
      <p
        className={`${textProps.getTailwind()} line-clamp-2 group-hover:text-warning-foreground`}
        style={textProps.getStyle()}
      >
        {(draftHeadline as string) ||
          'Insert the Headline for your property here! Make it good!'}
      </p>
    </div>
  );
};

export default HeadlineSection;
