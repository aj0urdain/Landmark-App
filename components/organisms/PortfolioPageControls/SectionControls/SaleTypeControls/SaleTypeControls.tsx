import React from "react";
import { useQuery } from "@tanstack/react-query";

import { saleTypeDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import SaleTypeDropdown from "./SaleTypeDropdown/SaleTypeDropdown";
import ClosingTimePicker from "./ExpressionsOfInterest/ClosingTimePicker/ClosingTimePicker";
import ClosingDatePicker from "./ExpressionsOfInterest/ClosingDatePicker/ClosingDatePicker";
import AuctionDetailsInput from "./Auction/AuctionDetailsInput/AuctionDetailsInput";

const SaleTypeControls = () => {
  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <SaleTypeDropdown />

      {saleTypeData?.saleType === "auction" && <AuctionDetailsInput />}

      {saleTypeData?.saleType === "expression" && (
        <div className="flex items-center justify-start gap-2">
          <ClosingTimePicker />
          <ClosingDatePicker />
        </div>
      )}
    </div>
  );
};

export default SaleTypeControls;
