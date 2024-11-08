import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LogoSelectionDialog from './LogoSelectionDialog/LogoSelectionDialog';

interface DocumentData {
  document_data: {
    logoData: {
      logoCount: number;
      logoOrientation: 'horizontal' | 'vertical';
      logos: string[];
    };
    [key: string]: unknown;
  };
  id: string;
}

const LogoControls: React.FC = () => {
  const [countDatabaseMessage, setCountDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const [orientationDatabaseMessage, setOrientationDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the document data
  const { data: documentData, isLoading: isDocumentLoading } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get draft logo data
  const draftLogoData = queryClient.getQueryData([
    'draftLogo',
    selectedListingId,
    selectedDocumentType,
  ]);

  const updateLogoCountMutation = useMutation({
    mutationFn: async (newCount: number) => {
      setCountDatabaseMessage({ status: 'pending', message: 'Updating logo count...' });
      const { error } = await supabase
        .from('documents')
        .update({
          document_data: {
            ...documentData?.document_data,
            logoData: {
              ...documentData?.document_data.logoData,
              logoCount: newCount,
              logos: (draftLogoData?.logos ?? []).slice(0, newCount),
            },
          },
        })
        .eq('id', documentData?.id ?? '');

      if (error) throw error;
    },
    onError: (error) => {
      console.error('Error updating logo count:', error);
      setCountDatabaseMessage({ status: 'error', message: 'Error updating logos!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving logos!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your logo settings to the cloud!
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
      setCountDatabaseMessage({ status: 'success', message: 'Logo count updated!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your logo settings have been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const updateLogoOrientationMutation = useMutation({
    mutationFn: async (newOrientation: 'horizontal' | 'vertical') => {
      setOrientationDatabaseMessage({
        status: 'pending',
        message: 'Updating orientation...',
      });
      const { error } = await supabase
        .from('documents')
        .update({
          document_data: {
            ...documentData?.document_data,
            logoData: {
              ...documentData?.document_data.logoData,
              logoOrientation: newOrientation,
            },
          },
        })
        .eq('id', documentData?.id ?? '');

      if (error) throw error;
    },
    onError: (error) => {
      console.error('Error updating logo orientation:', error);
      setOrientationDatabaseMessage({
        status: 'error',
        message: 'Error updating orientation!',
      });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving orientation!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your logo orientation to the cloud!
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
      setOrientationDatabaseMessage({
        status: 'success',
        message: 'Orientation updated!',
      });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Portfolio Page updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your logo orientation has been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleLogoCountChange = (value: string) => {
    const newCount = Number(value);

    // Update draft state immediately
    queryClient.setQueryData(
      ['draftLogo', selectedListingId, selectedDocumentType],
      (oldData: any) => ({
        ...oldData,
        logoCount: newCount,
        logos: (oldData?.logos ?? []).slice(0, newCount),
      }),
    );

    // Then update database
    updateLogoCountMutation.mutate(newCount);
  };

  const handleOrientationChange = (value: 'horizontal' | 'vertical') => {
    // Update draft state immediately
    queryClient.setQueryData(
      ['draftLogo', selectedListingId, selectedDocumentType],
      (oldData: any) => ({
        ...oldData,
        logoOrientation: value,
      }),
    );

    // Then update database
    updateLogoOrientationMutation.mutate(value);
  };

  // Initialize draft state if needed
  useEffect(() => {
    if (documentData && !draftLogoData) {
      queryClient.setQueryData(['draftLogo', selectedListingId, selectedDocumentType], {
        logoCount: documentData.document_data?.logoData?.logoCount ?? 0,
        logoOrientation:
          documentData.document_data?.logoData?.logoOrientation ?? 'horizontal',
        logos: documentData.document_data?.logoData?.logos ?? [],
      });
    }
  }, [documentData, draftLogoData, queryClient, selectedListingId, selectedDocumentType]);

  // Clear database messages after delay
  useEffect(() => {
    if (countDatabaseMessage) {
      const timer = setTimeout(() => {
        setCountDatabaseMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [countDatabaseMessage]);

  useEffect(() => {
    if (orientationDatabaseMessage) {
      const timer = setTimeout(() => {
        setOrientationDatabaseMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orientationDatabaseMessage]);

  if (isDocumentLoading) return null;

  return (
    <div className="flex flex-col space-y-4 animate-slide-down-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="w-full space-y-0.5">
          <Label htmlFor="number-of-logos" className="ml-2 text-xs text-muted-foreground">
            {countDatabaseMessage ? (
              <span
                className={`animate-slide-left-fade-in ${
                  countDatabaseMessage.status === 'success'
                    ? 'text-green-500'
                    : countDatabaseMessage.status === 'error'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                }`}
              >
                {countDatabaseMessage.message}
              </span>
            ) : (
              <span className="animate-slide-down-fade-in">Number of logos</span>
            )}
          </Label>
          <Select
            value={draftLogoData?.logoCount.toString() ?? '0'}
            onValueChange={handleLogoCountChange}
          >
            <SelectTrigger
              className={
                countDatabaseMessage?.status === 'success'
                  ? 'border-green-500'
                  : countDatabaseMessage?.status === 'error'
                    ? 'border-red-500'
                    : countDatabaseMessage?.status === 'pending'
                      ? 'border-yellow-500'
                      : ''
              }
            >
              <SelectValue placeholder="Number of logos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Logo</SelectItem>
              {[1, 2].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Logo' : 'Logos'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {draftLogoData?.logoCount > 0 && (
          <div className="w-full space-y-0.5">
            <Label
              htmlFor="logo-orientation"
              className="ml-2 text-xs text-muted-foreground"
            >
              {orientationDatabaseMessage ? (
                <span
                  className={`animate-slide-left-fade-in ${
                    orientationDatabaseMessage.status === 'success'
                      ? 'text-green-500'
                      : orientationDatabaseMessage.status === 'error'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                  }`}
                >
                  {orientationDatabaseMessage.message}
                </span>
              ) : (
                <span className="animate-slide-down-fade-in">Logo Orientation</span>
              )}
            </Label>
            <Select
              value={draftLogoData?.logoOrientation ?? 'horizontal'}
              onValueChange={handleOrientationChange}
            >
              <SelectTrigger
                className={
                  orientationDatabaseMessage?.status === 'success'
                    ? 'border-green-500'
                    : orientationDatabaseMessage?.status === 'error'
                      ? 'border-red-500'
                      : orientationDatabaseMessage?.status === 'pending'
                        ? 'border-yellow-500'
                        : ''
                }
              >
                <SelectValue placeholder="Logo orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {draftLogoData?.logoCount > 0 && (
        <div
          className={`grid gap-4 ${
            draftLogoData.logoOrientation === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1'
          } rounded-lg border border-slate-800 p-4`}
        >
          {Array.from({ length: draftLogoData?.logoCount ?? 0 }).map((_, index) => (
            <LogoSelectionDialog
              key={index}
              index={index}
              logoUrl={draftLogoData.logos[index]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoControls;
