import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useSearchParams } from 'next/navigation';

const PropertyCopySection = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the draft property copy data
  const { data: draftPropertyCopy } = useQuery({
    queryKey: ['draftPropertyCopy', selectedListingId, selectedDocumentType],
  });

  const textPropsText = textAlgorithm('propertyCopy');
  const textPropsBullet = textAlgorithm('propertyCopyBullet');

  // Section selection mutation
  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  // Parse the property copy string into an array of lines
  const contentBlocks = draftPropertyCopy
    ? (draftPropertyCopy as string).split('\n').filter((line) => line.trim() !== '')
    : [
        'Place your property copy here!',
        'Each line break (new line by hitting enter) will be treated as a separate block',
        "Click the dropdown and select 'Property Copy' to start editing!",
        'No need to create new blocks, Landmark will do that for you!',
      ];

  return (
    <div
      className={`absolute left-[36.5%] top-[76%] flex h-[18%] w-[29%] flex-col items-start justify-start gap-[6%] font-normal 
        group cursor-pointer hover:scale-[1.01] transition-all duration-300 z-10 overflow-y-hidden`}
      onClick={() => {
        updateSelectedSection('Property Copy' as SectionName);
      }}
    >
      {contentBlocks.map((block, index) => (
        <div key={index} className="flex w-full items-start justify-start gap-[2.75%]">
          <p
            className={`${textPropsBullet.getTailwind()} group-hover:text-warning-foreground`}
            style={textPropsBullet.getStyle()}
          >
            +
          </p>
          <p
            className={`${textPropsText.getTailwind()} w-full group-hover:text-warning-foreground`}
            style={textPropsText.getStyle()}
          >
            {block}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PropertyCopySection;
