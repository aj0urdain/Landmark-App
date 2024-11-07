import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { textAlgorithm } from '@/utils/sandbox/document-generator/portfolio-page/textAlgorithm';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { SectionName } from '@/types/portfolioControlsTypes';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/utils/supabase/client';

interface AuctionDetails {
  id: string;
  start_date: string;
  auction_venues: {
    name: string;
  };
  auction_locations: {
    name: string;
  };
}

const SaleTypeSection = () => {
  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get draft sale type data from cache
  const draftSaleTypeData = queryClient.getQueryData([
    'draftSaleType',
    selectedListingId,
    selectedDocumentType,
  ]);

  // Fetch auction details if we have an auction ID
  const { data: auctionDetails } = useQuery<AuctionDetails>({
    queryKey: ['auctionDetails', draftSaleTypeData?.auctionId],
    queryFn: async () => {
      if (!draftSaleTypeData?.auctionId) return null;

      const { data, error } = await supabase
        .from('auctions')
        .select(
          `
          id,
          start_date,
          auction_venues (
            name
          ),
          auction_locations (
            name
          )
        `,
        )
        .eq('id', draftSaleTypeData.auctionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!draftSaleTypeData?.auctionId,
  });

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  const textHeaderProps = textAlgorithm('contactHeader');
  const textProps = textAlgorithm('agents');
  const footNoteProps = textAlgorithm('footNote');

  const isAuction = draftSaleTypeData?.saleType === 'auction';

  const removeLeadingZero = (time: string | undefined) => {
    return time ? time.replace(/^0/, '') : '';
  };

  const formatAuctionTime = (dateString: string) => {
    const date = parseISO(dateString);
    const formattedTime = format(date, 'h:mma');
    return formattedTime.toLowerCase() + ' AEST';
  };

  const renderSaleTypeContent = () => {
    if (isAuction) {
      return (
        <>
          <div className="space-y-[5%]">
            <p
              className={`${textHeaderProps.getTailwind()} w-full font-black group-hover:text-warning-foreground`}
              style={textHeaderProps.getStyle()}
            >
              Investment Portfolio Auction
            </p>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start gap-[1.75%]">
            <p
              className={`${textProps.getTailwind()} w-full group-hover:text-warning-foreground`}
              style={textProps.getStyle()}
            >
              {auctionDetails?.start_date && formatAuctionTime(auctionDetails.start_date)}
            </p>
            <p
              className={`${textProps.getTailwind()} w-full group-hover:text-warning-foreground`}
              style={textProps.getStyle()}
            >
              {auctionDetails?.start_date &&
                format(new Date(auctionDetails.start_date), 'EEEE d MMMM yyyy')}
            </p>
            <p
              className={`${textProps.getTailwind()} w-full group-hover:text-warning-foreground`}
              style={textProps.getStyle()}
            >
              {auctionDetails?.auction_venues?.name ?? 'Venue TBA'},{' '}
              {auctionDetails?.auction_locations?.name ?? 'Location TBA'}
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="space-y-[5%]">
            <p
              className={`${textHeaderProps.getTailwind()} w-full font-black group-hover:text-warning-foreground`}
              style={textHeaderProps.getStyle()}
            >
              For Sale by
            </p>
            <p
              className={`${textHeaderProps.getTailwind()} w-full font-black group-hover:text-warning-foreground`}
              style={textHeaderProps.getStyle()}
            >
              Expressions of Interest
            </p>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start gap-[1.75%]">
            <p
              className={`${textProps.getTailwind()} w-full group-hover:text-warning-foreground`}
              style={textProps.getStyle()}
            >
              Closing{' '}
              {removeLeadingZero(draftSaleTypeData?.expressionOfInterest?.closingTime)}
              <span className="lowercase">
                {draftSaleTypeData?.expressionOfInterest?.closingAmPm}
              </span>{' '}
              AEST
            </p>
            <p
              className={`${textProps.getTailwind()} w-full group-hover:text-warning-foreground`}
              style={textProps.getStyle()}
            >
              {draftSaleTypeData?.expressionOfInterest?.closingDate &&
                format(
                  new Date(draftSaleTypeData.expressionOfInterest.closingDate),
                  'EEEE d MMMM yyyy',
                )}
            </p>
          </div>
        </>
      );
    }
  };

  return (
    <div
      className={`flex w-full items-start justify-start gap-[0.5%] font-medium 
        group cursor-pointer hover:scale-[1.01] transition-all duration-300 z-10`}
      onClick={() => {
        updateSelectedSection('Sale Type' as SectionName);
      }}
    >
      <div className="flex w-full max-w-[20%] items-center justify-center">
        {isAuction ? (
          <Image
            src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/Gavel@4x.png"
            alt="Gavel"
            width={300}
            height={300}
            className="h-auto w-[60%]"
          />
        ) : (
          <Image
            src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/Email@4x.png"
            alt="Email"
            width={300}
            height={300}
            className="h-auto w-[60%]"
          />
        )}
      </div>

      <div className="flex h-full w-full flex-col items-start justify-start gap-[25%]">
        <div className="flex h-full w-full flex-col items-start justify-start gap-[7%]">
          {renderSaleTypeContent()}
        </div>
        <div>
          <p
            className={`${footNoteProps.getTailwind()} w-full group-hover:text-warning-foreground`}
            style={footNoteProps.getStyle()}
          >
            *Approx
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleTypeSection;
