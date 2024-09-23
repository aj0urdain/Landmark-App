import { useQueryClient, useQuery } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import Image from "next/image";
import { saleTypeDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";
import { format, parseISO } from "date-fns";
import { createBrowserClient } from "@/utils/supabase/client";

const SaleTypeSection = () => {
  const queryClient = useQueryClient();
  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  const { data: auctionData } = useQuery({
    queryKey: ["auction", saleTypeData?.auctionId],
    queryFn: async () => {
      if (!saleTypeData?.auctionId) return null;
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("auctions")
        .select(
          `
          *,
          auction_locations (name),
          auction_venues (name)
        `,
        )
        .eq("id", saleTypeData.auctionId)
        .single();

      if (error) throw error;
      console.log("Auction data:", data);
      return data;
    },
    enabled: saleTypeData?.saleType === "auction" && !!saleTypeData?.auctionId,
  });

  const placeholderAuctionData = {
    date: new Date().toISOString(),
    auction_venues: { name: "Venue TBA" },
    auction_locations: { name: "Location TBA" },
  };

  const textHeaderProps = textAlgorithm("contactHeader", queryClient);
  const textProps = textAlgorithm("agents", queryClient);
  const footNoteProps = textAlgorithm("footNote", queryClient);

  const isAuction = saleTypeData?.saleType === "auction";

  const removeLeadingZero = (time: string | undefined) => {
    return time ? time.replace(/^0/, "") : "";
  };

  const formatAuctionTime = (dateString: string) => {
    const date = parseISO(dateString);
    const formattedTime = format(date, "h:mma");
    return formattedTime.toLowerCase() + " AEST";
  };

  const renderSaleTypeContent = () => {
    if (isAuction) {
      const displayData = auctionData || placeholderAuctionData;
      const date = displayData?.date ? new Date(displayData.date) : new Date();
      return (
        <>
          <div className="space-y-[5%]">
            <p
              className={`${textHeaderProps.getTailwind()} w-full font-black`}
              style={textHeaderProps.getStyle()}
            >
              Investment Portfolio Auction
            </p>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start gap-[1.75%]">
            <p
              className={`${textProps.getTailwind()} w-full`}
              style={textProps.getStyle()}
            >
              {formatAuctionTime(date.toISOString())}
            </p>
            <p
              className={`${textProps.getTailwind()} w-full`}
              style={textProps.getStyle()}
            >
              {format(date, "EEEE d MMMM yyyy")}
            </p>
            <p
              className={`${textProps.getTailwind()} w-full`}
              style={textProps.getStyle()}
            >
              {displayData.auction_venues?.name ?? "Venue TBA"},{" "}
              {displayData.auction_locations?.name ?? "Location TBA"}
            </p>
          </div>
        </>
      );
    } else {
      // Existing code for expression of interest
      return (
        <>
          <div className="space-y-[5%]">
            <p
              className={`${textHeaderProps.getTailwind()} w-full font-black`}
              style={textHeaderProps.getStyle()}
            >
              For Sale by
            </p>
            <p
              className={`${textHeaderProps.getTailwind()} w-full font-black`}
              style={textHeaderProps.getStyle()}
            >
              Expressions of Interest
            </p>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start gap-[1.75%]">
            <p
              className={`${textProps.getTailwind()} w-full`}
              style={textProps.getStyle()}
            >
              Closing{" "}
              {removeLeadingZero(
                saleTypeData?.expressionOfInterest?.closingTime,
              )}
              <span className="lowercase">
                {saleTypeData?.expressionOfInterest?.closingAmPm}
              </span>{" "}
              AEST
            </p>
            <p
              className={`${textProps.getTailwind()} w-full`}
              style={textProps.getStyle()}
            >
              {saleTypeData?.expressionOfInterest?.closingDate &&
                format(
                  new Date(saleTypeData.expressionOfInterest.closingDate),
                  "EEEE d MMMM yyyy",
                )}
            </p>
          </div>
        </>
      );
    }
  };

  return (
    <div
      className={`flex w-full items-start justify-start gap-[0.5%] font-medium`}
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
            className={`${footNoteProps.getTailwind()} w-full`}
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
