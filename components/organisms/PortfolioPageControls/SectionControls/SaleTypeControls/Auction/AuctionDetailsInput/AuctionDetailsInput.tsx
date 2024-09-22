import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUpcomingAuctions,
  Auction,
} from "@/utils/supabase/supabase-queries";
import {
  saleTypeDataOptions,
  updateSaleType,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuctionDetailsInput: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: saleTypeData } = useQuery(saleTypeDataOptions);
  const { data: auctions, isLoading } = useQuery({
    queryKey: ["upcomingAuctions"],
    queryFn: () => getUpcomingAuctions(10), // Fetch 10 upcoming auctions
  });

  const updateSaleTypeMutation = useMutation({
    mutationFn: updateSaleType,
    onSuccess: (newData) => {
      queryClient.setQueryData(["saleTypeData"], newData);
    },
  });

  const handleAuctionSelect = (auctionId: string) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      auctionId,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  if (isLoading) return <div>Loading auctions...</div>;

  return (
    <div className="w-full">
      <Label htmlFor="auction-select" className="text-xs text-slate-500">
        Select Auction
      </Label>
      <Select
        value={saleTypeData?.auctionId}
        onValueChange={handleAuctionSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an auction" />
        </SelectTrigger>
        <SelectContent>
          {auctions?.map((auction: Auction) => (
            <SelectItem key={auction.id} value={auction.id.toString()}>
              {auction.auction_locations.name}{" "}
              <span className="text-muted-foreground">
                {formatDate(auction.date)}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AuctionDetailsInput;
