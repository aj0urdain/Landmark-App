import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  saleTypeDataOptions,
  updateSaleType,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import SaleTypeDropdown from "./SaleTypeDropdown/SaleTypeDropdown";
import ClosingTimePicker from "./ExpressionsOfInterest/ClosingTimePicker/ClosingTimePicker";
import ClosingDatePicker from "./ExpressionsOfInterest/ClosingDatePicker/ClosingDatePicker";
import AuctionDetailsInput from "./Auction/AuctionDetailsInput/AuctionDetailsInput";

const SaleTypeControls = () => {
  const queryClient = useQueryClient();

  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  const handleAuctionTimeChange = (time: string) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      auctionTime: time,
    });
  };

  const handleAuctionAmPmChange = (amPm: "AM" | "PM") => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      auctionAmPm: amPm,
    });
  };

  const handleAuctionDateChange = (date: Date | undefined) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      auctionDate: date,
    });
  };

  const handleAuctionVenueChange = (venue: string) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      auctionVenue: venue,
    });
  };

  const updateSaleTypeMutation = useMutation({
    mutationFn: updateSaleType,
    onSuccess: (newData) => {
      queryClient.setQueryData(["saleTypeData"], newData);
    },
  });

  const handleClosingTimeChange = (time: string) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      closingTime: time,
    });
  };

  const handleClosingAmPmChange = (amPm: "AM" | "PM") => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      closingAmPm: amPm,
    });
  };

  const handleClosingDateChange = (date: Date | undefined) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      closingDate: date,
    });
  };

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <SaleTypeDropdown />

      {saleTypeData?.saleType === "auction" && (
        <AuctionDetailsInput
          auctionTime={saleTypeData.auctionTime || ""}
          auctionAmPm={saleTypeData.auctionAmPm || "AM"}
          auctionDate={saleTypeData.auctionDate}
          auctionVenue={saleTypeData.auctionVenue || ""}
          onTimeChange={handleAuctionTimeChange}
          onAmPmChange={handleAuctionAmPmChange}
          onDateChange={handleAuctionDateChange}
          onVenueChange={handleAuctionVenueChange}
        />
      )}

      {saleTypeData?.saleType === "expression" && (
        <div className="flex items-center justify-start gap-2">
          <ClosingTimePicker
            closingTime={saleTypeData.closingTime || ""}
            closingAmPm={saleTypeData.closingAmPm || "AM"}
            onTimeChange={handleClosingTimeChange}
            onAmPmChange={handleClosingAmPmChange}
          />
          <ClosingDatePicker
            closingDate={saleTypeData.closingDate}
            onDateChange={handleClosingDateChange}
          />
        </div>
      )}
    </div>
  );
};

export default SaleTypeControls;
