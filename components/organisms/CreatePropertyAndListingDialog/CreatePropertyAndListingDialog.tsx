'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Check, ChevronsRight, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface CreatePropertyAndListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add this helper function at the top of your component
const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function CreatePropertyAndListingDialog({
  open,
  onOpenChange,
}: CreatePropertyAndListingDialogProps) {
  const [step, setStep] = useState<'property' | 'listing'>('property');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('new');
  const [propertySelectOpen, setPropertySelectOpen] = useState(false);
  const [newPropertyData, setNewPropertyData] = useState({
    streetNumber: '',
    streetName: '',
    suburb: '',
    state: '',
    postcode: '',
  });

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const { toast } = useToast();

  // Modified query to get all properties
  const { data: availableProperties } = useQuery({
    queryKey: ['available-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(
          `
          id,
          street_number,
          streets (street_name),
          suburbs (suburb_name, postcode),
          states (short_name)
        `,
        )
        .order('id', { ascending: true });

      if (error) {
        console.error(error);
        return [];
      }
      return data;
    },
  });

  // Add new query for states
  const { data: availableStates } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('states')
        .select('*')
        .order('short_name', { ascending: true });

      if (error) {
        console.error(error);
        return [];
      }
      return data;
    },
  });

  // Add new query for portfolios
  const { data: availablePortfolios } = useQuery({
    queryKey: ['upcoming-portfolios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .gt('advertising_period_end', new Date().toISOString())
        .order('advertising_period_start', { ascending: true });

      if (error) {
        console.error(error);
        return [];
      }
      return data;
    },
  });

  // Add state for selected portfolio
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');

  const createPropertyMutation = useMutation({
    mutationFn: async (formData: typeof newPropertyData) => {
      // Capitalize street and suburb names
      const capitalizedStreetName = capitalizeWords(formData.streetName);
      const capitalizedSuburb = capitalizeWords(formData.suburb);

      // First, get the state ID from the selected state
      const { data: stateData } = await supabase
        .from('states')
        .select('id')
        .eq('short_name', formData.state)
        .single();

      if (!stateData?.id) {
        throw new Error('State not found');
      }

      // Create suburb if it doesn't exist
      const { data: suburbData, error: suburbError } = await supabase
        .from('suburbs')
        .select('id')
        .eq('suburb_name', capitalizedSuburb)
        .eq('state_id', stateData.id)
        .single();

      let suburbId: number;
      if (!suburbData) {
        const { data: newSuburb, error: newSuburbError } = await supabase
          .from('suburbs')
          .insert({
            suburb_name: capitalizedSuburb,
            state_id: stateData.id,
            postcode: formData.postcode,
          })
          .select()
          .single();

        if (newSuburbError) {
          console.error(newSuburbError);
          return null;
        }
        suburbId = newSuburb.id;
      } else {
        suburbId = suburbData.id;
      }

      // Create street if it doesn't exist
      const { data: streetData, error: streetError } = await supabase
        .from('streets')
        .select('id')
        .eq('street_name', capitalizedStreetName)
        .eq('suburb_id', suburbId)
        .eq('state_id', stateData.id)
        .single();

      let streetId: number;
      if (!streetData) {
        const { data: newStreet, error: newStreetError } = await supabase
          .from('streets')
          .insert({
            street_name: capitalizedStreetName,
            suburb_id: suburbId,
            state_id: stateData.id,
          })
          .select()
          .single();

        if (newStreetError) {
          console.error(newStreetError);
          return null;
        }
        streetId = newStreet.id;
      } else {
        streetId = streetData.id;
      }

      // In the mutation function, before creating the property
      const { data: existingProperty } = await supabase
        .from('properties')
        .select('id')
        .eq('street_number', formData.streetNumber)
        .eq('street_id', streetId)
        .eq('suburb_id', suburbId)
        .eq('state_id', stateData.id)
        .single();

      if (existingProperty) {
        // Property already exists, just return it
        return existingProperty;
      }

      // If no existing property, create a new one
      const { data: newProperty, error: propertyError } = await supabase
        .from('properties')
        .insert({
          street_number: formData.streetNumber,
          street_id: streetId,
          suburb_id: suburbId,
          state_id: stateData.id,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;
      return newProperty;
    },
    onSuccess: (data) => {
      queryClient
        .invalidateQueries({ queryKey: ['available-properties'] })
        .catch((error: unknown) => {
          console.error(error);
        });
      setSelectedPropertyId(data?.id.toString() ?? 'new');
      setStep('listing');
    },
    onError: (error) => {
      console.error('Error creating property:', error);
      // You might want to show an error toast/notification here
    },
  });

  const handlePropertySelect = (propertyId: string) => {
    if (propertyId === 'new') {
      setNewPropertyData({
        streetNumber: '',
        streetName: '',
        suburb: '',
        state: '',
        postcode: '',
      });
      setSelectedPropertyId('new');
      setPropertySelectOpen(false);
      return;
    }

    const selectedProperty = availableProperties?.find(
      (property) => property.id.toString() === propertyId,
    );

    if (selectedProperty) {
      setNewPropertyData({
        streetNumber: selectedProperty.street_number ?? '',
        streetName: selectedProperty.streets?.street_name ?? '',
        suburb: selectedProperty.suburbs?.suburb_name ?? '',
        state: selectedProperty.states?.short_name ?? '',
        postcode: selectedProperty.suburbs?.postcode ?? '',
      });
    }

    setSelectedPropertyId(propertyId);
    setPropertySelectOpen(false);
  };

  // Add this validation function
  const isFormValid = () => {
    return selectedPropertyId === 'new'
      ? newPropertyData.streetNumber.trim() !== '' &&
          newPropertyData.streetName.trim() !== '' &&
          newPropertyData.suburb.trim() !== '' &&
          newPropertyData.state.trim() !== '' &&
          /^\d{4}$/.test(newPropertyData.postcode)
      : true;
  };

  // Add the listing mutation
  const createListingMutation = useMutation({
    mutationFn: async ({
      propertyId,
      portfolioId,
    }: {
      propertyId: string;
      portfolioId: string;
    }) => {
      const { data: newListing, error } = await supabase
        .from('property_listings')
        .insert({
          property_id: parseInt(propertyId),
          portfolio: parseInt(portfolioId),
          // lead_agent will be automatically set to auth.uid() by the database
        })
        .select(
          `
          *,
          properties (
            id,
            street_number,
            streets (street_name),
            suburbs (suburb_name)
          )
        `,
        )
        .single();

      if (error) throw error;
      return newListing;
    },
    onSuccess: (data) => {
      queryClient
        .invalidateQueries({ queryKey: ['property-listings'] })
        .catch((error: unknown) => {
          console.error(error);
        });
      onOpenChange(false); // Close the dialog
      // You might want to show a success toast here
      toast({
        title: 'Listing created successfully',
        description: 'Your listing has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Error creating listing:', error);
      // You might want to show an error toast here
      toast({
        title: 'Error creating listing',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-fit h-full flex flex-col items-start">
        <DialogHeader>
          <DialogTitle>
            {step === 'property' ? 'Property Details' : 'Create Listing'}
          </DialogTitle>
          <DialogDescription>
            {step === 'property'
              ? 'Select an existing property or enter new property details'
              : 'Enter the listing details'}
          </DialogDescription>
        </DialogHeader>

        {step === 'property' && (
          <div className="flex flex-col gap-12 w-full">
            <Popover open={propertySelectOpen} onOpenChange={setPropertySelectOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={propertySelectOpen}
                  className="w-full justify-between"
                >
                  {selectedPropertyId === 'new'
                    ? 'Create New Property'
                    : (availableProperties?.find(
                        (property) => property.id.toString() === selectedPropertyId,
                      )?.streets?.street_name ?? 'Select property...')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
              >
                <Command>
                  <CommandInput placeholder="Search properties..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No properties found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem value="new" onSelect={handlePropertySelect}>
                        <div className="flex items-center">
                          <span>Create New Property</span>
                        </div>
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedPropertyId === 'new' ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                      {availableProperties?.map((property) => (
                        <CommandItem
                          key={property.id}
                          value={property.id.toString()}
                          onSelect={handlePropertySelect}
                        >
                          <div className="flex items-center">
                            <span>
                              {property.street_number} {property.streets?.street_name},{' '}
                              {property.suburbs?.suburb_name}
                            </span>
                          </div>
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              selectedPropertyId === property.id.toString()
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-col gap-8 h-full">
              <div className="flex flex-row gap-4 h-full">
                <div className="grid gap-2 w-fit">
                  <Label htmlFor="streetNumber" className="text-xs text-muted-foreground">
                    Street Number(s)
                  </Label>
                  <Input
                    id="streetNumber"
                    value={newPropertyData.streetNumber}
                    onChange={(e) => {
                      setNewPropertyData((prev) => ({
                        ...prev,
                        streetNumber: e.target.value,
                      }));
                    }}
                    disabled={selectedPropertyId !== 'new'}
                  />
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="streetName" className="text-xs text-muted-foreground">
                    Street Name
                  </Label>
                  <Input
                    id="streetName"
                    value={newPropertyData.streetName}
                    className="capitalize"
                    onChange={(e) => {
                      setNewPropertyData((prev) => ({
                        ...prev,
                        streetName: e.target.value,
                      }));
                    }}
                    disabled={selectedPropertyId !== 'new'}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="grid gap-2 w-full max-w-64">
                  <Label htmlFor="state" className="text-xs text-muted-foreground">
                    State
                  </Label>
                  <Select
                    value={newPropertyData.state}
                    onValueChange={(value) => {
                      setNewPropertyData((prev) => ({
                        ...prev,
                        state: value,
                      }));
                    }}
                    disabled={selectedPropertyId !== 'new'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates?.map((state) => (
                        <SelectItem key={state.id} value={state.short_name ?? ''}>
                          {state.state_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="suburb" className="text-xs text-muted-foreground">
                    Suburb
                  </Label>
                  <Input
                    id="suburb"
                    value={newPropertyData.suburb}
                    className="capitalize"
                    onChange={(e) => {
                      setNewPropertyData((prev) => ({
                        ...prev,
                        suburb: e.target.value,
                      }));
                    }}
                    disabled={selectedPropertyId !== 'new'}
                  />
                </div>
                <div className="grid gap-2 w-full min-w-24 max-w-32">
                  <Label htmlFor="postcode" className="text-xs text-muted-foreground">
                    Postcode
                  </Label>
                  <Input
                    id="postcode"
                    value={newPropertyData.postcode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setNewPropertyData((prev) => ({
                        ...prev,
                        postcode: value,
                      }));
                    }}
                    maxLength={4}
                    disabled={selectedPropertyId !== 'new'}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (selectedPropertyId !== 'new') {
                    setStep('listing');
                  } else {
                    createPropertyMutation.mutate(newPropertyData);
                  }
                }}
                disabled={createPropertyMutation.isPending || !isFormValid()}
              >
                {selectedPropertyId !== 'new'
                  ? 'Continue to Listing'
                  : createPropertyMutation.isPending
                    ? 'Creating Property...'
                    : 'Create Property'}
              </Button>
            </div>
          </div>
        )}

        {step === 'listing' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Selected Property</Label>
                <Popover
                  open={propertySelectOpen}
                  onOpenChange={setPropertySelectOpen}
                  modal
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={propertySelectOpen}
                      className="w-full justify-between"
                    >
                      {availableProperties?.find(
                        (property) => property.id.toString() === selectedPropertyId,
                      )?.streets?.street_name ?? 'Select property...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                  >
                    <Command>
                      <CommandInput placeholder="Search properties..." />
                      <CommandList>
                        <CommandEmpty>No properties found.</CommandEmpty>
                        <CommandGroup>
                          {availableProperties?.map((property) => (
                            <CommandItem
                              key={property.id}
                              value={property.id.toString()}
                              onSelect={handlePropertySelect}
                            >
                              <div className="flex items-center">
                                <span>
                                  {property.street_number} {property.streets?.street_name}
                                  , {property.suburbs?.suburb_name}
                                </span>
                              </div>
                              <Check
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  selectedPropertyId === property.id.toString()
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  Selected Portfolio for Listing
                </Label>
                <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                  <SelectTrigger className="h-fit">
                    <SelectValue placeholder="Select portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePortfolios?.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
                        <div className="flex flex-col gap-1">
                          <p className="font-bold">Portfolio {portfolio.id}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ChevronsRight className="h-2 w-2" />
                            {format(
                              new Date(portfolio.magazine_deadline ?? ''),
                              'dd MMMM yyyy',
                            )}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('property');
                  setSelectedPropertyId('new');
                }}
              >
                Back to Property Selection
              </Button>
              <Button
                disabled={!selectedPortfolio || createListingMutation.isPending}
                onClick={() => {
                  createListingMutation.mutate({
                    propertyId: selectedPropertyId,
                    portfolioId: selectedPortfolio,
                  });
                }}
              >
                {createListingMutation.isPending
                  ? 'Creating Listing...'
                  : 'Create Listing'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
