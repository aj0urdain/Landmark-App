import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import {
  headlineDataOptions,
  logoDataOptions,
} from '@/utils/sandbox/document-generator/portfolio-page/portfolio-queries';
import { SectionName } from '@/types/portfolioControlsTypes';

const HeadlineSection = () => {
  const queryClient = useQueryClient();

  const { data: headlineData } = useQuery(headlineDataOptions);
  const { data: logoData } = useQuery(logoDataOptions);

  const textProps = textAlgorithm('headline', queryClient);

  const getHeadlineWidth = () => {
    if (!logoData || logoData.logoCount === 0) return '90.5%';
    if (logoData.logoCount === 1) return '76.5%';
    return '62.5%';
  };

  const headlineWidth = getHeadlineWidth();

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  return (
    <div
      className={`absolute left-[4.75%] top-[68%] flex h-[5.5%] font-medium cursor-pointer hover:animate-pulse hover:scale-110 transition-all duration-300 hover:translate-x-[20px]`}
      style={{ width: headlineWidth }}
      onClick={() => {
        updateSelectedSection('Headline' as SectionName);
      }}
    >
      <span className={textProps.getTailwind()} style={textProps.getStyle()}>
        {headlineData?.headline ??
          'Insert the Headline for your property here! Make it good!'}
      </span>
    </div>
  );
};

export default HeadlineSection;
