import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
        closingTime: string;
        closingAmPm: 'AM' | 'PM';
        closingDate?: string;
      };
    };
    [key: string]: unknown;
  };
  id: string;
}

const ClosingTimePicker: React.FC = () => {
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

  const updateClosingTimeData = async (
    newTime: string | undefined,
    newAmPm: 'AM' | 'PM' | undefined,
  ) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          saleTypeData: {
            ...documentData?.document_data.saleTypeData,
            expressionOfInterest: {
              ...documentData?.document_data.saleTypeData.expressionOfInterest,
              ...(newTime && { closingTime: newTime }),
              ...(newAmPm && { closingAmPm: newAmPm }),
            },
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateClosingTimeMutation = useMutation({
    mutationFn: async ({ time, amPm }: { time?: string; amPm?: 'AM' | 'PM' }) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving closing time...' });
      await updateClosingTimeData(time, amPm);
    },
    onError: (error) => {
      console.error('Error updating closing time:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating time!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving time!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your closing time to the cloud!
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
      setDatabaseMessage({ status: 'success', message: 'Closing time saved!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your closing time has been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleClosingTimeChange = (time: string) => {
    // Update draft state with AM as default if no AM/PM is selected
    queryClient.setQueryData(['draftSaleType', selectedListingId, selectedDocumentType], {
      ...draftSaleTypeData,
      expressionOfInterest: {
        ...draftSaleTypeData?.expressionOfInterest,
        closingTime: time,
        closingAmPm: draftSaleTypeData?.expressionOfInterest?.closingAmPm || 'AM',
      },
    });

    // Save to database with AM as default if no AM/PM is selected
    updateClosingTimeMutation.mutate({
      time,
      ...(!draftSaleTypeData?.expressionOfInterest?.closingAmPm && { amPm: 'AM' }),
    });
  };

  const handleClosingAmPmChange = (amPm: 'AM' | 'PM') => {
    // Update draft state
    queryClient.setQueryData(['draftSaleType', selectedListingId, selectedDocumentType], {
      ...draftSaleTypeData,
      expressionOfInterest: {
        ...draftSaleTypeData?.expressionOfInterest,
        closingAmPm: amPm,
      },
    });
    // Save to database
    updateClosingTimeMutation.mutate({ amPm });
  };

  useEffect(() => {
    if (databaseMessage) {
      const timer = setTimeout(() => {
        setDatabaseMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [databaseMessage]);

  if (isLoading) return null;

  return (
    <div className="w-2/5 flex flex-col gap-2">
      <Label htmlFor="closing-time" className="pl-2 text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Closing Time</span>
        )}
      </Label>
      <div className="flex gap-2 w-full">
        <Select
          value={draftSaleTypeData?.expressionOfInterest?.closingTime}
          onValueChange={handleClosingTimeChange}
        >
          <SelectTrigger
            className={`w-full ${
              databaseMessage?.status === 'success'
                ? 'border-green-500 text-green-500'
                : databaseMessage?.status === 'error'
                  ? 'border-red-500 text-red-500'
                  : databaseMessage?.status === 'pending'
                    ? 'border-yellow-500 text-yellow-500'
                    : ''
            }`}
          >
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={draftSaleTypeData?.expressionOfInterest?.closingAmPm}
          onValueChange={handleClosingAmPmChange}
        >
          <SelectTrigger
            className={`w-full ${
              databaseMessage?.status === 'success'
                ? 'border-green-500 text-green-500'
                : databaseMessage?.status === 'error'
                  ? 'border-red-500 text-red-500'
                  : databaseMessage?.status === 'pending'
                    ? 'border-yellow-500 text-yellow-500'
                    : ''
            }`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClosingTimePicker;
