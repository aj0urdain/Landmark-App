import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import LogoUpload from './LogoUpload/LogoUpload';
import LogoUrl from './LogoUrl/LogoUrl';
import LogoDatabase from './LogoDatabase/LogoDatabase';

interface LogoSelectionDialogProps {
  index: number;
  logoUrl?: string;
}

const LogoSelectionDialog: React.FC<LogoSelectionDialogProps> = ({ index, logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [databaseMessage, setDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the document data
  const documentData = queryClient.getQueryData([
    'document',
    selectedListingId,
    selectedDocumentType,
  ]);

  const updateLogoInDatabase = async (newLogoUrl: string) => {
    const draftLogoData = queryClient.getQueryData([
      'draftLogo',
      selectedListingId,
      selectedDocumentType,
    ]);

    if (!documentData || !draftLogoData) throw new Error('Data not available');

    // Update the logos array in the draft data
    const updatedLogos = [...draftLogoData.logos];
    updatedLogos[index] = newLogoUrl;

    // Update draft state immediately
    queryClient.setQueryData(['draftLogo', selectedListingId, selectedDocumentType], {
      ...draftLogoData,
      logos: updatedLogos,
    });

    // Update database
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData.document_data,
          logoData: {
            ...documentData.document_data.logoData,
            logos: updatedLogos,
          },
        },
      })
      .eq('id', documentData.id);

    if (error) throw error;
  };

  const updateLogoMutation = useMutation({
    mutationFn: updateLogoInDatabase,
    onMutate: () => {
      setDatabaseMessage({ status: 'pending', message: 'Saving logo...' });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['document', selectedListingId, selectedDocumentType],
      });
      setDatabaseMessage({ status: 'success', message: 'Logo saved to cloud!' });
      setIsOpen(false);

      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Logo updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your logo has been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
    onError: (error) => {
      console.error('Error updating logo:', error);
      setDatabaseMessage({ status: 'error', message: 'Error saving logo!' });

      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving logo!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your logo to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleLogoUpdate = (newLogoUrl: string) => {
    updateLogoMutation.mutate(newLogoUrl);
  };

  // Get logo URL from draft state
  const draftLogoData = queryClient.getQueryData([
    'draftLogo',
    selectedListingId,
    selectedDocumentType,
  ]);
  const currentLogoUrl = draftLogoData?.logos?.[index] ?? '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`${currentLogoUrl ? 'bg-white' : 'bg-slate-900'} h-20 w-full border border-slate-700 ${
            databaseMessage?.status === 'success'
              ? 'border-green-500'
              : databaseMessage?.status === 'error'
                ? 'border-red-500'
                : databaseMessage?.status === 'pending'
                  ? 'border-yellow-500'
                  : ''
          }`}
        >
          {currentLogoUrl ? (
            <img
              src={currentLogoUrl}
              alt={`Logo ${index + 1}`}
              className="h-auto max-h-10 w-20 object-contain"
            />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <p className="text-xs font-bold">Add Logo</p>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-h-[800px] sm:min-h-[300px] sm:min-w-[600px] sm:max-w-[600px]">
        <h3>Add Logo</h3>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">Paste URL</TabsTrigger>
            <TabsTrigger value="database">From Database</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <LogoUpload onLogoSelect={handleLogoUpdate} />
          </TabsContent>
          <TabsContent value="url">
            <LogoUrl onLogoSelect={handleLogoUpdate} />
          </TabsContent>
          <TabsContent value="database">
            <LogoDatabase onLogoSelect={handleLogoUpdate} />
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex items-center justify-between">
          {currentLogoUrl && (
            <Button
              variant="destructive"
              onClick={() => handleLogoUpdate('')}
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Logo
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoSelectionDialog;
