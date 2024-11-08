import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Square, Rows2, LayoutPanelTop, LayoutGrid } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

const options = [
  { value: '1', label: '1 Image', icon: <Square size={16} /> },
  { value: '2', label: '2 Images', icon: <Rows2 size={16} /> },
  { value: '3', label: '3 Images', icon: <LayoutPanelTop size={16} /> },
  { value: '4', label: '4 Images', icon: <LayoutGrid size={16} /> },
];

export const PhotoLayoutSelector: React.FC = () => {
  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;
  const [databaseMessage, setDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  // Get the document data
  const { data: documentData } = useQuery({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get draft photo data
  const { data: draftPhotoData } = useQuery({
    queryKey: ['draftPhoto', selectedListingId, selectedDocumentType],
  });

  const updatePhotoData = async (newCount: number) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          photoData: {
            ...documentData?.document_data.photoData,
            photoCount: newCount,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updatePhotoCountMutation = useMutation({
    mutationFn: async (newCount: number) => {
      setDatabaseMessage({ status: 'pending', message: 'Saving photo layout...' });
      await updatePhotoData(newCount);
    },
    onError: (error) => {
      console.error('Error updating photo count:', error);
      setDatabaseMessage({ status: 'error', message: 'Error saving photo layout!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving photo layout!</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
    onSuccess: async () => {
      setDatabaseMessage({ status: 'success', message: 'Photo layout saved!' });
      await queryClient.invalidateQueries({
        queryKey: ['document', selectedListingId, selectedDocumentType],
      });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Photo layout saved!</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleValueChange = (value: string) => {
    const newCount = parseInt(value);

    // Update draft state
    queryClient.setQueryData(['draftPhoto', selectedListingId, selectedDocumentType], {
      ...draftPhotoData,
      photoCount: newCount,
    });

    // Save to database
    updatePhotoCountMutation.mutate(newCount);
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

  if (!draftPhotoData) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="photoLayout" className="pl-2 text-xs text-muted-foreground">
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
          <span className="animate-slide-down-fade-in">Photo Layout</span>
        )}
      </Label>
      <Select
        value={draftPhotoData.photoCount?.toString()}
        onValueChange={handleValueChange}
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
          <SelectValue placeholder="Select layout" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  <span className="ml-2">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
