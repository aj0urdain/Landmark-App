import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useSearchParams } from 'next/navigation';

const AddressSection = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const textProps = textAlgorithm('address');

  // Get draft address data with useQuery for real-time updates
  const { data: draftAddressData } = useQuery({
    queryKey: ['draftAddress', selectedListingId, selectedDocumentType],
  });

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  // Format address lines
  const getAddressLine1 = () => {
    if (!draftAddressData?.addressLine1) {
      return 'Suburb STATE';
    }
    return draftAddressData.addressLine1;
  };

  const getAddressLine2 = () => {
    if (!draftAddressData?.addressLine2) {
      return 'Street Number and Name';
    }
    return draftAddressData.addressLine2;
  };

  return (
    <div
      onClick={() => {
        updateSelectedSection('Address' as SectionName);
      }}
      className={`absolute left-[4.75%] top-[76.1%] flex h-[5.5%] w-[30%] flex-col 
        items-start justify-center -space-y-[1.5%] border-y border-portfolio-border 
        font-medium cursor-pointer hover:scale-[1.01] transition-all duration-300 z-10
        group`}
    >
      <p
        className={`${textProps.getTailwind()} w-full group-hover:text-warning-foreground`}
        style={textProps.getStyle()}
      >
        {getAddressLine1()}
      </p>
      <p
        className={`${textProps.getTailwind()} w-full group-hover:text-warning-foreground`}
        style={textProps.getStyle()}
      >
        {getAddressLine2()}
      </p>
    </div>
  );
};

export default AddressSection;
