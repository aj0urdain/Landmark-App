import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
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
      financeAmount?: string;
    };
    [key: string]: unknown;
  };
  id: string;
}

const FinanceAmountInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
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

  // Initialize input value from draft data
  useEffect(() => {
    if (draftFinanceData?.financeAmount) {
      setInputValue(draftFinanceData.financeAmount);
    }
  }, [draftFinanceData?.financeAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(newValue)) return;

    // Update local state
    setInputValue(newValue);

    // Update draft state
    queryClient.setQueryData(['draftFinance', selectedListingId, selectedDocumentType], {
      ...draftFinanceData,
      financeAmount: newValue,
    });
  };

  const handleBlur = () => {
    // Save to database if changed
    const oldAmount = documentData?.document_data?.financeData?.financeAmount;
    if (!oldAmount || inputValue !== oldAmount) {
      updateFinanceAmountMutation.mutate(inputValue);
    }
  };

  const updateFinanceAmountData = async (newAmount: string) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          financeData: {
            ...documentData?.document_data.financeData,
            financeAmount: newAmount,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateFinanceAmountMutation = useMutation({
    mutationFn: async (amount: string) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving amount...' });
      await updateFinanceAmountData(amount);
    },
    onError: (error) => {
      console.error('Error updating finance amount:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating amount!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving finance amount!</CardTitle>
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
      setDatabaseMessage({ status: 'success', message: 'Finance amount saved!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Finance amount saved to cloud!</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

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
    <div className="space-y-2">
      <Label htmlFor="finance-amount" className="text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Finance Amount</span>
        )}
      </Label>
      <Input
        id="finance-amount"
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter finance amount"
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
    </div>
  );
};

export default FinanceAmountInput;
