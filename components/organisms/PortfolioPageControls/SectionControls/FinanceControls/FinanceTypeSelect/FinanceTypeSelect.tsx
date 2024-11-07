import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';

interface DocumentData {
  document_data: {
    financeData: {
      financeType: string;
      customFinanceType?: string;
    };
    [key: string]: unknown;
  };
  id: string;
}

const FinanceTypeSelect: React.FC = () => {
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

  // Get draft finance data
  const draftFinanceData = queryClient.getQueryData([
    'draftFinance',
    selectedListingId,
    selectedDocumentType,
  ]);

  // Initialize draft state when document data is available
  useEffect(() => {
    if (documentData && !draftFinanceData) {
      queryClient.setQueryData(
        ['draftFinance', selectedListingId, selectedDocumentType],
        documentData.document_data.financeData,
      );
    }
  }, [
    documentData,
    draftFinanceData,
    queryClient,
    selectedListingId,
    selectedDocumentType,
  ]);

  const updateFinanceTypeData = async (newType: string, newCustomType?: string) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          financeData: {
            ...documentData?.document_data.financeData,
            financeType: newType,
            ...(newCustomType !== undefined && { customFinanceType: newCustomType }),
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateFinanceTypeMutation = useMutation({
    mutationFn: async ({ type, customType }: { type: string; customType?: string }) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving finance type...' });
      await updateFinanceTypeData(type, customType);
    },
    onError: (error) => {
      console.error('Error updating finance type:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating type!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving finance type!</CardTitle>
              </div>
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
      setDatabaseMessage({ status: 'success', message: 'Finance type saved!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Finance type saved to cloud!</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleFinanceTypeChange = (type: string) => {
    // Update draft state
    queryClient.setQueryData(['draftFinance', selectedListingId, selectedDocumentType], {
      ...draftFinanceData,
      financeType: type,
      ...(type !== 'custom' && { customFinanceType: undefined }),
    });
    // Save to database
    updateFinanceTypeMutation.mutate({
      type,
      ...(type !== 'custom' && { customType: undefined }),
    });
  };

  const handleCustomTypeChange = (customType: string) => {
    // Update draft state
    queryClient.setQueryData(['draftFinance', selectedListingId, selectedDocumentType], {
      ...draftFinanceData,
      customFinanceType: customType,
    });
    // Save to database
    updateFinanceTypeMutation.mutate({
      type: draftFinanceData?.financeType ?? 'custom',
      customType,
    });
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
    <div className="space-y-2">
      <Label htmlFor="finance-type" className="pl-2 text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Finance Type</span>
        )}
      </Label>
      <Select
        value={draftFinanceData?.financeType}
        onValueChange={handleFinanceTypeChange}
      >
        <SelectTrigger
          id="finance-type"
          className={
            databaseMessage?.status === 'success'
              ? 'border-green-500 text-green-500'
              : databaseMessage?.status === 'error'
                ? 'border-red-500 text-red-500'
                : databaseMessage?.status === 'pending'
                  ? 'border-yellow-500 text-yellow-500'
                  : ''
          }
        >
          <SelectValue placeholder="Select finance type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rent">Rent</SelectItem>
          <SelectItem value="net_income">Net Income</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      {draftFinanceData?.financeType === 'custom' && (
        <Input
          value={draftFinanceData?.customFinanceType}
          onChange={(e) => handleCustomTypeChange(e.target.value)}
          placeholder="Enter custom finance type"
          className={
            databaseMessage?.status === 'success'
              ? 'border-green-500 text-green-500'
              : databaseMessage?.status === 'error'
                ? 'border-red-500 text-red-500'
                : databaseMessage?.status === 'pending'
                  ? 'border-yellow-500 text-yellow-500'
                  : ''
          }
        />
      )}
    </div>
  );
};

export default FinanceTypeSelect;
