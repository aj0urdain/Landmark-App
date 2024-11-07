import React from 'react';
import { useQuery } from '@tanstack/react-query';

import SaleTypeDropdown from './SaleTypeDropdown/SaleTypeDropdown';
import ClosingTimePicker from './ExpressionsOfInterest/ClosingTimePicker/ClosingTimePicker';
import ClosingDatePicker from './ExpressionsOfInterest/ClosingDatePicker/ClosingDatePicker';
import AuctionDetailsInput from './Auction/AuctionDetailsInput/AuctionDetailsInput';
import { useSearchParams } from 'next/dist/client/components/navigation';

const SaleTypeControls = () => {
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const { data: saleTypeData } = useQuery({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  const saleType = saleTypeData?.document_data?.saleTypeData?.saleType;

  return (
    <div className="flex flex-col items-start justify-center gap-8 animate-slide-down-fade-in">
      <SaleTypeDropdown />

      {saleType === 'auction' && <AuctionDetailsInput />}

      {saleType === 'expression' && (
        <div className="flex items-center justify-start w-full gap-8">
          <ClosingTimePicker />
          <ClosingDatePicker />
        </div>
      )}
    </div>
  );
};

export default SaleTypeControls;
