import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import { getStateConfig } from '@/lib/stateConfigs';
import { useSearchParams } from 'next/navigation';
import { SectionName } from '@/types/portfolioControlsTypes';

const LocationTab = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const { data: draftAddressData } = useQuery({
    queryKey: ['draftAddress', selectedListingId, selectedDocumentType],
  });

  // const previewSettings = queryClient.getQueryData(['previewSettings']) as
  //   | { zoom: number; pageSide?: 'left' | 'right' }
  //   | undefined;

  const { data: previewSettings } = useQuery({
    queryKey: ['previewSettings'],
  }) as
    | {
        zoom: number;
        pageSide?: 'left' | 'right';
      }
    | undefined;

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  const pageSide = previewSettings?.pageSide ?? 'right';

  const textProps = textAlgorithm('locationTab');

  const { tabName, tabColor, textColor } = getStateConfig(draftAddressData?.state || '');

  const hasState = !!draftAddressData?.state;

  return (
    <div
      className={`absolute ${
        pageSide === 'right'
          ? 'right-[0%] items-end justify-end rounded-bl-xl pr-[4.75%]'
          : 'left-[0%] items-end justify-start rounded-br-xl pl-[4.75%]'
      } top-[0%] flex h-[4.5%] w-[28.5%] pb-[1.9%] font-extrabold cursor-pointer 
      group hover:scale-[1.01] transition-all duration-300`}
      style={{
        backgroundColor: hasState ? tabColor : '#E5E7EB',
        width: draftAddressData?.state === 'act' ? '34.65%' : '28.5%',
      }}
      onClick={() => {
        updateSelectedSection('Address' as SectionName);
      }}
    >
      <span
        className={`${textProps.getTailwind()} uppercase tracking-widest group-hover:text-warning-foreground`}
        style={{
          ...textProps.getStyle(),
          color: hasState ? textColor : '#9CA3AF',
        }}
      >
        {hasState ? tabName : 'No State'}
      </span>
    </div>
  );
};

export default LocationTab;
