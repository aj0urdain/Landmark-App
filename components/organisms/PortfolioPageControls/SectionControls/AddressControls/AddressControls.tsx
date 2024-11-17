import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Lock, FileCheck, X } from 'lucide-react';
import StateSelector from './StateSelector/StateSelector';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentData {
  listing_id: number;
  property_listings: {
    property: {
      state: { short_name: string };
      street: { street_name: string };
      suburb: { suburb_name: string };
      street_number: string;
    };
  };
}

const AddressControls: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [databaseMessage, setDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the document data for property details
  const { data: documentData } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get draft address data
  const { data: draftAddressData } = useQuery({
    queryKey: ['draftAddress', selectedListingId, selectedDocumentType],
  });

  // Initialize draft state when document data is available
  useEffect(() => {
    if (documentData && !draftAddressData) {
      const property = documentData.property_listings.property;
      queryClient.setQueryData(
        ['draftAddress', selectedListingId, selectedDocumentType],
        {
          suburb: property.suburb.suburb_name,
          state: property.state.short_name,
          street: property.street.street_name,
          streetNumber: property.street_number,
          addressLine1: `${property.suburb.suburb_name} ${property.state.short_name}`,
          addressLine2: `${property.street_number} ${property.street.street_name}`,
        },
      );
    }
  }, [
    documentData,
    draftAddressData,
    queryClient,
    selectedListingId,
    selectedDocumentType,
  ]);

  // add effect to restore cursor position
  useEffect(() => {
    if (cursorPosition !== null) {
      const input = document.getElementById('addressLine1') as HTMLInputElement;
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, draftAddressData]);

  const updateAddressData = async (newAddressData: typeof draftAddressData) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          addressData: newAddressData,
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateAddressMutation = useMutation({
    mutationFn: updateAddressData,
    onError: (error) => {
      console.error('Error updating address:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating address!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving address!</CardTitle>
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
      setDatabaseMessage({ status: 'success', message: 'Address saved!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Address saved to cloud!</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleBlur = () => {
    const oldAddressData = documentData?.document_data?.addressData;
    if (JSON.stringify(draftAddressData) !== JSON.stringify(oldAddressData)) {
      updateAddressMutation.mutate(draftAddressData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCursorPosition(document.getElementById(field)?.selectionStart ?? null);
    queryClient.setQueryData(['draftAddress', selectedListingId, selectedDocumentType], {
      ...draftAddressData,
      [field]: value,
      // Update address lines when base fields change
      ...(field === 'streetNumber' || field === 'street'
        ? {
            addressLine1: `${field === 'streetNumber' ? value : draftAddressData?.streetNumber} ${field === 'street' ? value : draftAddressData?.street}`,
          }
        : {}),
      ...(field === 'suburb' || field === 'state'
        ? {
            addressLine2: `${field === 'suburb' ? value : draftAddressData?.suburb} ${field === 'state' ? value : draftAddressData?.state}`,
          }
        : {}),
    });
  };

  // ... useEffect for message timeout ...
  useEffect(() => {
    if (databaseMessage) {
      const timer = setTimeout(() => {
        setDatabaseMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [databaseMessage]);

  return (
    <div className="flex flex-col h-full gap-12 animate-slide-down-fade-in">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">
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
              'Address Details'
            )}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Lock className="h-4 w-4" />
                Lock Fields
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                Edit Fields
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="space-y-0.5 max-w-20 w-full">
            <Label htmlFor="streetNumber" className="pl-2 text-xs text-muted-foreground">
              Number
            </Label>
            <Input
              id="streetNumber"
              value={draftAddressData?.streetNumber ?? ''}
              onChange={(e) => handleInputChange('streetNumber', e.target.value)}
              disabled={!isEditing}
              className="bg-muted"
            />
          </div>
          <div className="space-y-0.5 w-full">
            <Label htmlFor="street" className="pl-2 text-xs text-muted-foreground">
              Street
            </Label>
            <Input
              id="street"
              value={draftAddressData?.street ?? ''}
              onChange={(e) => handleInputChange('street', e.target.value)}
              disabled={!isEditing}
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="suburb" className="pl-2 text-xs text-muted-foreground">
              Suburb
            </Label>
            <Input
              id="suburb"
              value={draftAddressData?.suburb ?? ''}
              onChange={(e) => handleInputChange('suburb', e.target.value)}
              onBlur={handleBlur}
              disabled={!isEditing}
              className="bg-muted"
            />
          </div>
          <StateSelector
            selectedState={draftAddressData?.state ?? ''}
            onStateSelect={(state) => handleInputChange('state', state)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* <Label className="text-sm font-medium">Generated Address</Label> */}
        <div className="space-y-0.5">
          <Label htmlFor="addressLine1" className="text-xs text-muted-foreground">
            Address Line 1
          </Label>
          <Input
            id="addressLine1"
            value={draftAddressData?.addressLine1 ?? ''}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            onBlur={handleBlur}
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
        <div className="space-y-0.5">
          <Label htmlFor="addressLine2" className="pl-2 text-xs text-muted-foreground">
            Address Line 2
          </Label>
          <Input
            id="addressLine2"
            value={draftAddressData?.addressLine2 ?? ''}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            onBlur={handleBlur}
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
      </div>
    </div>
  );
};

export default AddressControls;
