import { useQueryClient, useMutation } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import Image from 'next/image';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useSearchParams } from 'next/navigation';

const AgentSection = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const textHeaderProps = textAlgorithm('contactHeader');
  const textProps = textAlgorithm('agents');

  // Get draft agents from cache
  const draftAgents = queryClient.getQueryData([
    'draftAgents',
    selectedListingId,
    selectedDocumentType,
  ]);

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  const displayAgents = draftAgents?.length
    ? draftAgents
    : [
        { name: 'Select Agents', phone: '0400 000 000' },
        { name: 'Use the picker', phone: '0400 000 000' },
        { name: 'To add agents!', phone: '0400 000 000' },
      ];

  return (
    <div
      className={`flex w-full items-start justify-start gap-[0.5%] font-medium 
        group cursor-pointer hover:scale-[1.01] transition-all duration-300 z-10`}
      onClick={() => {
        updateSelectedSection('Agents' as SectionName);
      }}
    >
      <div className="flex w-full max-w-[20%] items-center justify-center">
        <Image
          src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/Phone@4x.png"
          alt="Phone"
          width={300}
          height={300}
          className="h-auto w-[35%]"
        />
      </div>

      <div className="flex h-full w-full flex-col items-start justify-start gap-[4.5%]">
        <p
          className={`${textHeaderProps.getTailwind()} w-full font-black group-hover:text-warning-foreground`}
          style={textHeaderProps.getStyle()}
        >
          Contact
        </p>
        <div className="flex h-full w-full flex-col items-start justify-start">
          {displayAgents.map((agent, index) => (
            <p
              key={index}
              className={`${textProps.getTailwind()} w-full ${
                !draftAgents?.length ? 'text-gray-400' : ''
              } group-hover:text-warning-foreground`}
              style={textProps.getStyle()}
            >
              {agent.name} {agent.phone}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSection;
