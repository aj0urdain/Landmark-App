import React, { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, Gavel, MailQuestion, FileCheck, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface DocumentData {
  document_data: {
    saleTypeData: {
      saleType: 'auction' | 'expression' | null;
      auctionId?: string;
      expressionOfInterest?: {
        closingDate: string;
        closingTime: string;
      };
    };
    [key: string]: unknown;
  };
  id: string;
}

const SaleTypeDropdown: React.FC = () => {
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const [databaseMessage, setDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const supabase = createBrowserClient();

  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the persisted document data
  const { data: documentData, isLoading } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get draft sale type
  const draftSaleType = queryClient.getQueryData([
    'draftSaleType',
    selectedListingId,
    selectedDocumentType,
  ]);

  useEffect(() => {
    if (triggerRef.current) {
      setMenuWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  const updateSaleTypeData = async (newSaleType: 'auction' | 'expression') => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          saleTypeData: {
            ...documentData?.document_data.saleTypeData,
            saleType: newSaleType,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateSaleTypeMutation = useMutation({
    mutationFn: async (newSaleType: 'auction' | 'expression') => {
      setDatabaseMessage({ status: 'pending', message: 'Saving sale type...' });
      await updateSaleTypeData(newSaleType);
    },
    onError: (error) => {
      console.error('Error updating sale type:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating sale type!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving sale type!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your sale type to the cloud!
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
      setDatabaseMessage({ status: 'success', message: 'Sale type saved to cloud!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your sale type has been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleSaleTypeSelect = (saleType: 'auction' | 'expression') => {
    // Update draft state
    queryClient.setQueryData(['draftSaleType', selectedListingId, selectedDocumentType], {
      ...draftSaleType,
      saleType,
    });
    // Save to database
    updateSaleTypeMutation.mutate(saleType);
  };

  const getDisplayContent = () => {
    switch (draftSaleType?.saleType) {
      case 'auction':
        return (
          <>
            <Gavel className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Auction
          </>
        );
      case 'expression':
        return (
          <>
            <MailQuestion className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Expression of Interest
          </>
        );
      default:
        return 'Select Sale Type';
    }
  };

  useEffect(() => {
    if (databaseMessage) {
      const timer = setTimeout(() => {
        setDatabaseMessage(null);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [databaseMessage]);

  if (isLoading) return null;

  return (
    <div className="flex w-full flex-col space-y-2 animate-slide-down-fade-in">
      <Label htmlFor="sale-type" className="pl-2 text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Sale Type</span>
        )}
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={false}
            className={`w-full justify-between ${
              databaseMessage?.status === 'success'
                ? 'border-green-500 text-green-500'
                : databaseMessage?.status === 'error'
                  ? 'border-red-500 text-red-500'
                  : databaseMessage?.status === 'pending'
                    ? 'border-yellow-500 text-yellow-500'
                    : ''
            }`}
          >
            <div className="flex items-center">{getDisplayContent()}</div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ width: menuWidth }} className="w-full">
          <DropdownMenuItem
            onClick={() => {
              handleSaleTypeSelect('auction');
            }}
          >
            <Gavel className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Auction
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleSaleTypeSelect('expression');
            }}
          >
            <MailQuestion className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Expression of Interest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SaleTypeDropdown;
