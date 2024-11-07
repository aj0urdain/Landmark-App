import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';

interface DocumentData {
  document_data: {
    saleTypeData: {
      saleType: 'auction' | 'expression' | null;
      expressionOfInterest?: {
        closingDate?: string;
        closingTime?: string;
        closingAmPm?: 'AM' | 'PM';
      };
    };
    [key: string]: unknown;
  };
  id: string;
}

const ClosingDatePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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
  const { data: documentData, isLoading } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get draft sale type data instead of specific closing date
  const draftSaleTypeData = queryClient.getQueryData([
    'draftSaleType',
    selectedListingId,
    selectedDocumentType,
  ]);

  // Initialize both selected date and draft state when document data is available
  useEffect(() => {
    if (documentData) {
      const closingDate =
        documentData.document_data.saleTypeData.expressionOfInterest?.closingDate;
      const dateValue = closingDate ? new Date(closingDate) : undefined;

      // Set local state
      setSelectedDate(dateValue);

      // Set draft state if it doesn't exist
      if (!draftSaleTypeData) {
        queryClient.setQueryData(
          ['draftSaleType', selectedListingId, selectedDocumentType],
          {
            ...documentData.document_data.saleTypeData,
          },
        );
      }
    }
  }, [
    documentData,
    draftSaleTypeData,
    queryClient,
    selectedListingId,
    selectedDocumentType,
  ]);

  const updateClosingDateData = async (newDate: Date | undefined) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          saleTypeData: {
            ...documentData?.document_data.saleTypeData,
            expressionOfInterest: {
              ...documentData?.document_data.saleTypeData.expressionOfInterest,
              closingDate: newDate?.toISOString(),
            },
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) {
      console.error('Error updating closing date:', error);
      throw error;
    }
  };

  const updateClosingDateMutation = useMutation({
    mutationFn: async (date: Date | undefined) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving closing date...' });
      await updateClosingDateData(date);
    },
    onError: (error) => {
      console.error('Error updating closing date:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating date!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving date!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your closing date to the cloud!
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
      setDatabaseMessage({ status: 'success', message: 'Closing date saved!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your closing date has been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleClosingDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Only save when closing the popover and if the date has changed
    if (
      !open &&
      selectedDate?.toISOString() !== draftSaleTypeData?.expressionOfInterest?.closingDate
    ) {
      // Update draft state
      queryClient.setQueryData(
        ['draftSaleType', selectedListingId, selectedDocumentType],
        {
          ...draftSaleTypeData,
          expressionOfInterest: {
            ...draftSaleTypeData?.expressionOfInterest,
            closingDate: selectedDate?.toISOString(),
          },
        },
      );
      // Save to database
      updateClosingDateMutation.mutate(selectedDate);
    }
  };

  const handleQuickSelect = (days: number) => {
    const newDate = addDays(new Date(), days);
    setSelectedDate(newDate);
    setIsOpen(false);
    // Quick select immediately saves
    queryClient.setQueryData(['draftSaleType', selectedListingId, selectedDocumentType], {
      ...draftSaleTypeData,
      expressionOfInterest: {
        ...draftSaleTypeData?.expressionOfInterest,
        closingDate: newDate?.toISOString(),
      },
    });
    updateClosingDateMutation.mutate(newDate);
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
    <div className="w-3/5 flex flex-col gap-2">
      <Label htmlFor="closing-date" className="pl-2 text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Closing Date</span>
        )}
      </Label>
      <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="closing-date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground',
              databaseMessage?.status === 'success'
                ? 'border-green-500 text-green-500'
                : databaseMessage?.status === 'error'
                  ? 'border-red-500 text-red-500'
                  : databaseMessage?.status === 'pending'
                    ? 'border-yellow-500 text-yellow-500'
                    : '',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
          <Select
            onValueChange={(value) => {
              handleQuickSelect(parseInt(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Quick select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="3">In 3 days</SelectItem>
              <SelectItem value="7">In a week</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleClosingDateChange}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ClosingDatePicker;
