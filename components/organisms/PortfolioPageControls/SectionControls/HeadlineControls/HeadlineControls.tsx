import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';

interface DocumentData {
  document_data: {
    headlineData: {
      headline: string;
    };
    [key: string]: unknown; // for other properties that might exist
  };
  id: string;
}

const HeadlineControls: React.FC = () => {
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

  const handleBlur = () => {
    const oldHeadline = documentData?.document_data?.headlineData?.headline;

    if (!oldHeadline || draftHeadline !== oldHeadline) {
      updateHeadlineMutation.mutate(draftHeadline as string);
    }

    return;
  };

  // Get the persisted document data
  const { data: documentData, isLoading: isDocumentLoading } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // get the draft headline
  const draftHeadline = queryClient.getQueryData([
    'draftHeadline',
    selectedListingId,
    selectedDocumentType,
  ]);

  const updateHeadlineData = async (newHeadline: string) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          headlineData: {
            ...documentData?.document_data.headlineData,
            headline: newHeadline,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) {
      return error;
    }

    return;
  };

  const updateHeadlineMutation = useMutation({
    mutationFn: async (newHeadline: string) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving headline...' });
      await updateHeadlineData(newHeadline);
    },
    onError: (error) => {
      console.error('Error updating headline:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating headline!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader className="">
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving headline!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your headline to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        {
          position: 'bottom-center',
        },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['document', selectedListingId, selectedDocumentType],
      });
      setDatabaseMessage({ status: 'success', message: 'Headline saved to cloud!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader className="">
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your headline has been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        {
          position: 'bottom-center',
        },
      );
    },
  });

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Store cursor position
    setCursorPosition(e.target.selectionStart);
    queryClient.setQueryData(
      ['draftHeadline', selectedListingId, selectedDocumentType],
      newValue,
    );
  };

  // Add effect to restore cursor position
  useEffect(() => {
    if (cursorPosition !== null) {
      const input = document.getElementById('headline') as HTMLInputElement;
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, draftHeadline]);

  useEffect(() => {
    setTimeout(() => {
      setDatabaseMessage(null);
    }, 3000);
  }, [databaseMessage]);

  if (isDocumentLoading) {
    return null; // or a loading spinner
  }

  return (
    <div className="space-y-2 animate-slide-down-fade-in">
      <Label htmlFor="headline" className="text-xs text-muted-foreground">
        {databaseMessage ? (
          <span
            className={`animate-slide-left-fade-in ${databaseMessage.status === 'success' ? 'text-green-500' : databaseMessage.status === 'error' ? 'text-red-500' : 'text-yellow-500'}`}
          >
            {databaseMessage.message}
          </span>
        ) : (
          <span className="animate-slide-down-fade-in">Headline</span>
        )}
      </Label>
      <Input
        id="headline"
        value={draftHeadline as string}
        onChange={handleHeadlineChange}
        onBlur={handleBlur}
        placeholder="Enter headline..."
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

export default HeadlineControls;
