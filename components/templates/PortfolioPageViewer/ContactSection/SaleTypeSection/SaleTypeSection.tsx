import { useQueryClient, useQuery } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import Image from "next/image";
import { saleTypeDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
// import { format } from "date-fns";

const SaleTypeSection = () => {
  const queryClient = useQueryClient();
  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  // const textHeaderProps = textAlgorithm("contactHeader", queryClient);
  // const textProps = textAlgorithm("agents", queryClient);
  const footNoteProps = textAlgorithm("footNote", queryClient);

  const isAuction = saleTypeData?.saleType === "auction";

  // const removeLeadingZero = (time: string | undefined) => {
  //   return time ? time.replace(/^0/, "") : "";
  // };

  const renderSaleTypeContent = () => {
    return <div>Hello</div>;

    // if (isAuction) {
    //   return (
    //     <>
    //       <div className="space-y-[5%]">
    //         <p
    //           className={`${textHeaderProps.getTailwind()} w-full font-black`}
    //           style={textHeaderProps.getStyle()}
    //         >
    //           Investment Portfolio Auction
    //         </p>
    //         {/* <p
    //           className={`${textHeaderProps.getTailwind()} w-full font-black`}
    //           style={textHeaderProps.getStyle()}
    //         >
    //           Auction
    //         </p> */}
    //       </div>
    //       <div className="flex h-full w-full flex-col items-start justify-start gap-[1.75%]">
    //         <p
    //           className={`${textProps.getTailwind()} w-full`}
    //           style={textProps.getStyle()}
    //         >
    //           {removeLeadingZero(saleTypeData?.auctionTime)}
    //           <span className="lowercase">
    //             {saleTypeData?.auctionAmPm}
    //           </span>{" "}
    //           AEST
    //         </p>
    //         <p
    //           className={`${textProps.getTailwind()} w-full`}
    //           style={textProps.getStyle()}
    //         >
    //           {saleTypeData?.auctionDate &&
    //             format(new Date(saleTypeData.auctionDate), "EEEE d MMMM")}{" "}
    //         </p>
    //         <p
    //           className={`${textProps.getTailwind()} w-full`}
    //           style={textProps.getStyle()}
    //         >
    //           {saleTypeData?.auctionVenue}
    //         </p>
    //       </div>
    //     </>
    //   );
    // } else {
    //   return (
    //     <>
    //       <div className="space-y-[5%]">
    //         <p
    //           className={`${textHeaderProps.getTailwind()} w-full font-black`}
    //           style={textHeaderProps.getStyle()}
    //         >
    //           For Sale by
    //         </p>
    //         <p
    //           className={`${textHeaderProps.getTailwind()} w-full font-black`}
    //           style={textHeaderProps.getStyle()}
    //         >
    //           Expressions of Interest
    //         </p>
    //       </div>
    //       <div className="flex h-full w-full flex-col items-start justify-start gap-[1.75%]">
    //         <p
    //           className={`${textProps.getTailwind()} w-full`}
    //           style={textProps.getStyle()}
    //         >
    //           Closing {removeLeadingZero(saleTypeData?.closingTime)}
    //           <span className="lowercase">
    //             {saleTypeData?.closingAmPm}
    //           </span>{" "}
    //           AEST
    //         </p>
    //         <p
    //           className={`${textProps.getTailwind()} w-full`}
    //           style={textProps.getStyle()}
    //         >
    //           {saleTypeData?.closingDate &&
    //             format(new Date(saleTypeData.closingDate), "EEEE d MMMM yyyy")}
    //         </p>
    //       </div>
    //     </>
    //   );
    // }
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
