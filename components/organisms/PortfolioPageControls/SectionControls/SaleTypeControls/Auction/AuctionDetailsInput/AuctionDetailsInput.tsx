import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUpcomingAuctions, Auction } from '@/utils/supabase/supabase-queries';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpenText, ChevronsRight, MapPin, FileCheck, X } from 'lucide-react';
import { formatDate } from 'date-fns';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface DocumentData {
  document_data: {
    saleTypeData: {
      saleType: 'auction' | 'expression' | null;
      auctionId?: string;
    };
    [key: string]: unknown;
  };
  id: string;
}

const AuctionDetailsInput: React.FC = () => {
  const [databaseMessage, setDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the persisted document data
  const { data: documentData, isLoading: isDocumentLoading } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get upcoming auctions
  const { data: auctions, isLoading: isAuctionsLoading } = useQuery({
    queryKey: ['upcomingAuctions'],
    queryFn: () => getUpcomingAuctions(10),
  });

  // Get draft sale type data
  const draftSaleTypeData = queryClient.getQueryData([
    'draftSaleType',
    selectedListingId,
    selectedDocumentType,
  ]);

  // Initialize draft state when document data is available
  useEffect(() => {
    if (documentData && !draftSaleTypeData) {
      queryClient.setQueryData(
        ['draftSaleType', selectedListingId, selectedDocumentType],
        documentData.document_data.saleTypeData,
      );
    }
  }, [
    documentData,
    draftSaleTypeData,
    queryClient,
    selectedListingId,
    selectedDocumentType,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setDatabaseMessage(null);
    }, 3000);
  }, [databaseMessage]);

  const updateAuctionData = async (auctionId: string) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          saleTypeData: {
            ...documentData?.document_data.saleTypeData,
            auctionId,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateAuctionMutation = useMutation({
    mutationFn: async (auctionId: string) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving auction details...' });
      await updateAuctionData(auctionId);
    },
    onError: (error) => {
      console.error('Error updating auction details:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating auction!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving auction!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your auction details to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['document', selectedListingId, selectedDocumentType],
      });
      setDatabaseMessage({ status: 'success', message: 'Auction details saved!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your auction details have been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleAuctionSelect = (auctionId: string) => {
    // Update draft state
    queryClient.setQueryData(['draftSaleType', selectedListingId, selectedDocumentType], {
      ...draftSaleTypeData,
      auctionId,
    });
    // Save to database
    updateAuctionMutation.mutate(auctionId);
  };

  const groupAndSortAuctions = (auctions: Auction[]) => {
    const grouped = auctions.reduce(
      (acc, auction) => {
        const portfolioId = auction.portfolio_id;
        if (!acc[portfolioId]) {
          acc[portfolioId] = [];
        }
        acc[portfolioId].push(auction);
        return acc;
      },
      {} as Record<string, Auction[]>,
    );

    Object.values(grouped).forEach((group) => {
      group.sort(
        (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      );
    });

    return grouped;
  };

  if (isDocumentLoading || isAuctionsLoading) return null;

  const groupedAuctions = auctions ? groupAndSortAuctions(auctions) : {};

  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor="auction-select" className="text-xs pl-2 text-muted-foreground">
        {databaseMessage ? (
          <span
            className={`animate-slide-left-fade-in ${
              databaseMessage.status === 'success'
                ? 'text-green-500'
                : databaseMessage.status === 'error'
                  ? 'text-red-500'
                  : 'text-yellow-500'
            }`}
          >
            {databaseMessage.message}
          </span>
        ) : (
          <span className="animate-slide-down-fade-in">Select Auction</span>
        )}
      </Label>
      <Select value={draftSaleTypeData?.auctionId} onValueChange={handleAuctionSelect}>
        <SelectTrigger
          className={`w-full h-fit ${
            databaseMessage?.status === 'success'
              ? 'border-green-500 text-green-500'
              : databaseMessage?.status === 'error'
                ? 'border-red-500 text-red-500'
                : databaseMessage?.status === 'pending'
                  ? 'border-yellow-500 text-yellow-500'
                  : ''
          }`}
        >
          <SelectValue placeholder="Select an auction" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <ScrollArea className="h-full">
            {Object.entries(groupedAuctions).map(([portfolioId, auctionGroup]) => (
              <React.Fragment key={portfolioId}>
                <SelectItem
                  value={`portfolio-${portfolioId}`}
                  disabled
                  className="py-2 w-full"
                >
                  <div className="flex items-center gap-2">
                    <BookOpenText className="h-2 w-2" />
                    Portfolio {portfolioId}
                  </div>
                </SelectItem>
                {auctionGroup.map((auction: Auction) => (
                  <SelectItem
                    key={auction.id}
                    value={auction.id.toString()}
                    className="pl-8 w-full group"
                  >
                    <div className="flex flex-col gap-1 items-start justify-start w-full py-2">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground text-xs bg-muted/50 font-bold rounded-full px-2 py-1">
                          {auction.portfolio_id ?? ''}
                        </p>
                        <p className="font-extrabold text-lg">
                          {auction.auction_locations.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium group-hover:hidden animate-slide-right-fade-in">
                          {formatDate(auction.start_date, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-foreground font-medium hidden group-hover:block animate-slide-left-fade-in">
                          {formatDate(auction.start_date, 'eeee, dd MMMM, yyyy')} @{' '}
                          {formatDate(auction.start_date, 'hh:mm a')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground mt-1">
                        <MapPin className="h-2 w-2" />
                        <p className="text-xs">{auction.auction_venues.name}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </React.Fragment>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AuctionDetailsInput;
