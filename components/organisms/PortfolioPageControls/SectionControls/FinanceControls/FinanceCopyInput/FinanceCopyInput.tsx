import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';

interface DocumentData {
  document_data: {
    financeData: {
      financeCopy: string;
    };
    [key: string]: unknown;
  };
  id: string;
}

const FinanceCopyInput: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [databaseMessage, setDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const updateFinanceCopyData = async (newCopy: string) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          financeData: {
            ...documentData?.document_data.financeData,
            financeCopy: newCopy,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateFinanceCopyMutation = useMutation({
    mutationFn: async (newCopy: string) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving finance copy...' });
      await updateFinanceCopyData(newCopy);
    },
    onError: (error) => {
      console.error('Error updating finance copy:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating finance copy!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving finance copy!</CardTitle>
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
      setDatabaseMessage({ status: 'success', message: 'Finance copy saved!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Finance copy saved to cloud!</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleFinanceCopyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCursorPosition(e.target.selectionStart);
    queryClient.setQueryData(['draftFinance', selectedListingId, selectedDocumentType], {
      ...draftFinanceData,
      financeCopy: newValue,
    });
  };

  const handleBlur = () => {
    const oldCopy = documentData?.document_data?.financeData?.financeCopy;
    if (draftFinanceData?.financeCopy !== oldCopy) {
      updateFinanceCopyMutation.mutate(draftFinanceData?.financeCopy);
    }
  };

  useEffect(() => {
    if (databaseMessage) {
      const timer = setTimeout(() => {
        setDatabaseMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [databaseMessage]);

  useEffect(() => {
    if (cursorPosition !== null) {
      const textarea = document.getElementById('finance-copy') as HTMLTextAreaElement;
      textarea?.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, draftFinanceData?.financeCopy]);

  if (isLoading) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="finance-copy" className="pl-2 text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Finance Copy</span>
        )}
      </Label>
      <Textarea
        ref={textareaRef}
        id="finance-copy"
        value={draftFinanceData?.financeCopy}
        onChange={handleFinanceCopyChange}
        onBlur={handleBlur}
        placeholder="Enter finance copy here... (Each line will be a separate block)"
        rows={8}
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

export default FinanceCopyInput;
