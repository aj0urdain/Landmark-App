'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/card';
import { BookOpenText, Check, ChevronsUpDown, Pencil, User } from 'lucide-react';
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
import { CreatePropertyAndListingDialog } from '@/components/organisms/CreatePropertyAndListingDialog/CreatePropertyAndListingDialog';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import PreviewControls from '@/components/organisms/PortfolioPageControls/PreviewControls/PreviewControls';
import PortfolioPageControls from '@/components/organisms/PortfolioPageControls/PortfolioPageControls';
import PortfolioPageViewer from '@/components/templates/PortfolioPageViewer/PortfolioPageViewer';
import { toast } from 'sonner';

interface PortfolioPageContentProps {
  searchParams: ReturnType<typeof useSearchParams>;
  router: ReturnType<typeof useRouter>;
}

const PortfolioPageContent = ({ searchParams, router }: PortfolioPageContentProps) => {
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [documentTypeOpen, setDocumentTypeOpen] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(0);
  const supabase = createBrowserClient();

  const queryClient = useQueryClient();

  useQuery({
    queryKey: ['previewSettings'],
    queryFn: () => ({
      zoom: 1,
      overlayOpacity: 0.5,
      showOverlay: false,
      pageSide: 'right' as 'right' | 'left',
    }),
  });

  const getDocumentTypes = async () => {
    const { data, error } = await supabase
      .from('document_types')
      .select(
        `
        *,
        documents!left(
          id,
          created_at,
          document_owner:user_profiles(first_name, last_name, email, profile_picture)
        )
      `,
      )
      .eq('documents.listing_id', selectedListingId ?? -1)
      .ilike('type_name', '%portfolio%');

    if (error) {
      console.error(error);
    }

    return data;
  };

  const getListings = async () => {
    const { data, error } = await supabase
      .from('property_listings')
      .select(
        `
        id, portfolio,
        lead_agent:user_profiles(first_name, last_name, email, profile_picture),
        property:properties(id, street_number, street:streets(street_name), suburb:suburbs(suburb_name), state:states(short_name))
        `,
      )
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
    }

    console.log('getListings');
    console.log(data);

    return data;
  };

  const getListing = async (listingId: string) => {
    const { data, error } = await supabase
      .from('property_listings')
      .select(
        `
        id, lead_agent:user_profiles(first_name, last_name, email, profile_picture),
        property:properties(id, street_number, street:streets(street_name), suburb:suburbs(suburb_name), state:states(short_name))
        `,
      )
      .eq('id', listingId)
      .single();

    if (error) {
      console.error(error);
    }

    console.log(data);

    return data;
  };

  const getDocument = async (listingId: string, documentTypeId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select(
        `
        *,
        property_listings!left(
          id,
          property:properties(id, street_number, street:streets(street_name), suburb:suburbs(suburb_name), state:states(short_name))
        ),
        document_owner:user_profiles(first_name, last_name, email, profile_picture)
        `,
      )
      .eq('listing_id', listingId)
      .eq('document_type_id', documentTypeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(error);
      throw error;
    }

    return { data: data ?? null, error: null };
  };

  const {
    data: listings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['listings'],
    queryFn: () => getListings(),
  });

  const { data: listingData, error: listingError } = useQuery({
    queryKey: ['listing', selectedListingId],
    queryFn: () => getListing(selectedListingId ?? ''),
    enabled: !!selectedListingId,
  });

  const { data: documentTypes, error: documentTypesError } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: () => getDocumentTypes(),
  });

  // get the document data
  const {
    data: documentData,
    error: documentError,
    isFetching,
  } = useQuery({
    enabled: !!selectedListingId && !!selectedDocumentType,
    queryKey: ['document', selectedListingId, selectedDocumentType],
    queryFn: async () => {
      console.log('Fetching document:', { selectedListingId, selectedDocumentType });
      const { data: documentData, error } = await getDocument(
        selectedListingId ?? '',
        selectedDocumentType ?? '',
      );

      console.log('documentData');
      console.log(documentData);

      if (error) {
        console.error('Document fetch error:', error);
        throw error;
      }

      if (!documentData) {
        console.log('No document found');
        return null;
      }

      if (documentData?.document_data.headlineData) {
        queryClient.setQueryData(
          ['draftHeadline', selectedListingId, selectedDocumentType],
          documentData.document_data.headlineData.headline as string,
        );
      }

      if (documentData?.document_data.propertyCopyData) {
        queryClient.setQueryData(
          ['draftPropertyCopy', selectedListingId, selectedDocumentType],
          documentData.document_data.propertyCopyData.propertyCopy as string,
        );
      }

      if (documentData?.document_data.agentsData) {
        queryClient.setQueryData(
          ['draftAgents', selectedListingId, selectedDocumentType],
          documentData.document_data.agentsData.agents,
        );
      }

      if (documentData?.document_data.saleTypeData) {
        queryClient.setQueryData(
          ['draftSaleType', selectedListingId, selectedDocumentType],
          documentData.document_data.saleTypeData,
        );
      }

      if (documentData?.document_data.financeData) {
        queryClient.setQueryData(
          ['draftFinance', selectedListingId, selectedDocumentType],
          documentData.document_data.financeData,
        );
      }

      if (documentData?.document_data.addressData) {
        queryClient.setQueryData(
          ['draftAddress', selectedListingId, selectedDocumentType],
          documentData.document_data.addressData,
        );
      }

      if (documentData?.document_data?.photoData) {
        queryClient.setQueryData(
          ['draftPhoto', selectedListingId, selectedDocumentType],
          documentData.document_data.photoData,
        );
      }

      if (documentData?.document_data?.logoData) {
        queryClient.setQueryData(
          ['draftLogo', selectedListingId, selectedDocumentType],
          documentData.document_data.logoData,
        );
      }

      return documentData;
    },
    staleTime: Infinity,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading properties</p>;

  if (documentError) {
    toast.error(documentError.message);
  }

  return (
    <>
      <CreatePropertyAndListingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <div className="flex h-full w-full items-center justify-center gap-4">
        <div className="flex h-full w-[45%] flex-col gap-4">
          <Card className="h-fit w-full p-4">
            <div className="mb-4">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="pl-2 text-xs text-muted-foreground">
                    Select Listing
                  </Label>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedListingId
                          ? `Listing ${selectedListingId}`
                          : 'Select listing...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0"
                      style={{ width: 'var(--radix-popover-trigger-width)' }}
                    >
                      <Command>
                        <CommandInput placeholder="Search listings..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No listings found.</CommandEmpty>
                          <CommandGroup heading="Actions">
                            <CommandItem
                              onSelect={() => {
                                setDialogOpen(true);
                                setOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                <span>Create New Listing</span>
                              </div>
                            </CommandItem>
                          </CommandGroup>
                          {listings?.reduce((groups, listing) => {
                            const portfolioId = listing.portfolio;

                            if (!groups[portfolioId]) {
                              groups[portfolioId] = {
                                name: `Portfolio ${portfolioId}`,
                                listings: [],
                              };
                            }
                            groups[portfolioId].listings.push(listing);
                            return groups;
                          }, {}) &&
                            Object.entries(
                              listings.reduce((groups, listing) => {
                                const portfolioId = listing.portfolio;
                                if (!groups[portfolioId]) {
                                  groups[portfolioId] = {
                                    name: (
                                      <div
                                        key={portfolioId}
                                        className="flex items-center gap-1.5"
                                      >
                                        <BookOpenText className="h-3.5 w-3.5" />
                                        Portfolio {portfolioId}
                                      </div>
                                    ),
                                    listings: [],
                                  };
                                }
                                groups[portfolioId].listings.push(listing);
                                return groups;
                              }, {}),
                            ).map(([portfolioId, group]) => (
                              <CommandGroup key={portfolioId} heading={group.name}>
                                {group.listings.map((listing) => (
                                  <CommandItem
                                    key={listing.id}
                                    value={listing.id.toString()}
                                    onSelect={(currentValue) => {
                                      router.push(
                                        `/sandbox/document-generator/portfolio-page?listing=${currentValue}`,
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <span>Listing {listing.id}</span>
                                      {listing.property?.street?.street_name && (
                                        <span className="ml-2 text-muted-foreground">
                                          - {listing.property.street.street_name}
                                        </span>
                                      )}
                                    </div>
                                    <Check
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        selectedListingId === listing.id.toString()
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {listingData && (
                  <div className="flex flex-col gap-2">
                    <Label className="pl-2 text-xs text-muted-foreground">
                      Select Portfolio Page Type
                    </Label>

                    <Popover open={documentTypeOpen} onOpenChange={setDocumentTypeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={documentTypeOpen}
                          className="w-full justify-between"
                        >
                          {selectedDocumentType
                            ? documentTypes?.find(
                                (dt) => dt.id.toString() === selectedDocumentType,
                              )?.type_name
                            : 'Select Portfolio Page type...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search document types..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No document types found.</CommandEmpty>
                            <CommandGroup>
                              {documentTypes?.map((documentType) => (
                                <CommandItem
                                  key={documentType.id}
                                  value={documentType.id.toString()}
                                  onSelect={(currentValue) => {
                                    router.push(
                                      `/sandbox/document-generator/portfolio-page?listing=${selectedListingId}&documentType=${currentValue}`,
                                    );
                                    setDocumentTypeOpen(false);
                                  }}
                                >
                                  <div className="flex w-full flex-col">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">
                                        Portfolio Page
                                      </p>
                                      {(documentType.type_name
                                        .toLowerCase()
                                        .includes('single') ||
                                        documentType.type_name
                                          .toLowerCase()
                                          .includes('double')) && (
                                        <span className="text-xs uppercase">
                                          {
                                            documentType.type_name.match(
                                              /(single|double)/i,
                                            )?.[0]
                                          }
                                        </span>
                                      )}
                                      {documentType.type_name
                                        .toLowerCase()
                                        .includes('premium') && (
                                        <span className="rounded-md bg-blue-500/50 px-1.5 py-0.5 text-xs font-bold uppercase text-foreground">
                                          Premium
                                        </span>
                                      )}
                                    </div>
                                    {documentType.documents?.[0] && (
                                      <div className="flex flex-col items-start  gap-2">
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Pencil className="h-2.5 w-2.5" />
                                          {format(
                                            new Date(
                                              documentType.documents[0].created_at,
                                            ),
                                            'dd MMMM yyyy',
                                          )}
                                        </span>
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <User className="h-2.5 w-2.5" />
                                          {
                                            documentType.documents[0].document_owner
                                              .first_name
                                          }{' '}
                                          {
                                            documentType.documents[0].document_owner
                                              .last_name
                                          }
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      selectedDocumentType === documentType.id.toString()
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
                )}
              </div>
            </div>
          </Card>

          <PortfolioPageControls
            isDisabled={!selectedListingId || !selectedDocumentType || !documentData}
            canEdit={true}
          />
        </div>
        <div className="relative z-10 flex h-full w-[55%] flex-col gap-4">
          <PreviewControls
            isDisabled={!selectedListingId}
            setRerenderKey={setRerenderKey}
          />
          <Card className="flex h-full overflow-hidden">
            <PortfolioPageViewer />
          </Card>
        </div>
      </div>
    </>
  );
};

export default PortfolioPageContent;
