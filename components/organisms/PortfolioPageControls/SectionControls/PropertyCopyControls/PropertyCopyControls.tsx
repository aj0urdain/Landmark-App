import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';

interface DocumentData {
  document_data: {
    propertyCopyData: {
      propertyCopy: string;
    };
  };
  id: string;
}

const PropertyCopyControls: React.FC = () => {
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

  // Get the persisted document data
  const { data: documentData, isLoading } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get the draft property copy
  const draftPropertyCopy = queryClient.getQueryData([
    'draftPropertyCopy',
    selectedListingId,
    selectedDocumentType,
  ]);

  const updatePropertyCopyData = async (newCopy: string) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          propertyCopyData: {
            ...documentData?.document_data.propertyCopyData,
            propertyCopy: newCopy,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) {
      return error;
    }

    return;
  };

  const updatePropertyCopyMutation = useMutation({
    mutationFn: async (newCopy: string) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving property copy...' });
      await updatePropertyCopyData(newCopy);
    },
    onError: (error) => {
      console.error('Error updating property copy:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating property copy!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader className="">
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving property copy!</CardTitle>
              </div>
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
      setDatabaseMessage({ status: 'success', message: 'Property copy saved to cloud!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader className="">
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Property copy saved to cloud!</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ),
        {
          position: 'bottom-center',
        },
      );
    },
  });

  const handlePropertyCopyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCursorPosition(e.target.selectionStart);
    queryClient.setQueryData(
      ['draftPropertyCopy', selectedListingId, selectedDocumentType],
      newValue,
    );
  };

  const handleBlur = () => {
    const oldCopy = documentData?.document_data?.propertyCopyData?.propertyCopy;
    if (!oldCopy || draftPropertyCopy !== oldCopy) {
      updatePropertyCopyMutation.mutate(draftPropertyCopy as string);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setDatabaseMessage(null);
    }, 3000);
  }, [databaseMessage]);

  useEffect(() => {
    if (cursorPosition !== null) {
      const input = document.getElementById('property-copy') as HTMLInputElement;
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, draftPropertyCopy]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-2 animate-slide-down-fade-in">
      <Label htmlFor="property-copy" className="text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Property Copy</span>
        )}
      </Label>
      <Textarea
        id="property-copy"
        value={draftPropertyCopy as string}
        onChange={handlePropertyCopyChange}
        onBlur={handleBlur}
        placeholder="Enter property copy here..."
        rows={6}
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

export default PropertyCopyControls;
