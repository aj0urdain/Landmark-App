import { createBrowserClient } from '@/utils/supabase/client';
import { getProfileFromID } from '@/utils/supabase/supabase-queries';
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { createClient } from "@/utils/supabase/client";

interface PhotoData {
  photoCount: number;
  photos: {
    original: string | null;
    cropped: string | null; // This will be the same as original
    crop: { x: number; y: number; width: number; height: number } | null;
  }[];
}
// Photo Data
export const photoDataOptions = queryOptions({
  queryKey: ['photoData'],
  queryFn: (): Promise<PhotoData> => {
    const queryClient = new QueryClient();
    const documentData = queryClient.getQueryData<{
      documentSnapshot: DocumentData;
    }>(['documentData']);

    // Return existing data if available
    if (documentData?.documentSnapshot?.photoData) {
      return documentData.documentSnapshot.photoData;
    }

    // Fall back to defaults if no existing data
    return {
      photoCount: 3,
      photos: Array(3).fill({
        original: null,
        cropped: null,
        crop: null,
      }),
    };
  },
});

// Update photo count
export const updatePhotoCount = async (
  newCount: number,
  currentPhotoData: PhotoData,
): Promise<PhotoData> => {
  // const supabase = createClient();
  console.log('Updating photo count to', newCount);

  // Create a new photos array with the new length, preserving existing data
  const newPhotos = Array(Math.max(newCount, currentPhotoData.photos.length))
    .fill(null)
    .map((_, index) => {
      if (index < currentPhotoData.photos.length) {
        // Preserve existing photo data
        return currentPhotoData.photos[index];
      } else {
        // Add new empty photo slots if needed
        return { original: null, cropped: null, crop: null };
      }
    });

  const newPhotoData = {
    ...currentPhotoData,
    photoCount: newCount,
    photos: newPhotos,
  };

  // Here you would update the data in Supabase
  // await supabase.from('photos').update(newPhotoData).eq('id', currentPhotoData.id);

  return newPhotoData;
};

// Update single photo
export const updatePhoto = async (
  index: number,
  original: string,
  cropped: string,
  crop: { x: number; y: number; width: number; height: number },
  currentPhotoData: PhotoData,
): Promise<PhotoData> => {
  // const supabase = createClient();
  // This would be an API call to update the photo in Supabase
  console.log(`Updating photo at index ${index}`);

  const newPhotos = [...currentPhotoData.photos];
  newPhotos[index] = { original, cropped, crop };
  const newPhotoData = { ...currentPhotoData, photos: newPhotos };

  // Here you would update the data in Supabase
  // await supabase.from('photos').update(newPhotoData).eq('id', currentPhotoData.id);

  return newPhotoData;
};

interface LogoData {
  logoCount: number;
  logoOrientation: 'horizontal' | 'vertical';
  logos: string[];
}

export const logoDataOptions = queryOptions({
  queryKey: ['logoData'],
  queryFn: async (): Promise<LogoData> => {
    // const supabase = createClient();
    // Fetch logo data from Supabase
    // For now, we'll return a dummy structure
    return {
      logoCount: 0,
      logoOrientation: 'horizontal',
      logos: [''],
    };
  },
});

export const updateLogoCount = async (
  newCount: number,
  currentLogoData: LogoData,
): Promise<LogoData> => {
  // const supabase = createClient();
  console.log('Updating logo count to', newCount);

  // Create a new logos array with the new length, preserving existing data
  const newLogos = Array(Math.max(newCount, currentLogoData.logos.length))
    .fill('')
    .map((_, index) => {
      if (index < currentLogoData.logos.length) {
        // Preserve existing logo data
        return currentLogoData.logos[index];
      } else {
        // Add new empty logo slots if needed
        return '';
      }
    });

  const newLogoData = {
    ...currentLogoData,
    logoCount: newCount,
    logos: newLogos,
  };

  // Here you would update the data in Supabase
  // await supabase.from('logos').update(newLogoData).eq('id', currentLogoData.id);

  return newLogoData;
};

export const updateLogoOrientation = async (
  newOrientation: 'horizontal' | 'vertical',
  currentLogoData: LogoData,
): Promise<LogoData> => {
  // const supabase = createClient();
  console.log('Updating logo orientation to', newOrientation);

  const newLogoData = {
    ...currentLogoData,
    logoOrientation: newOrientation,
  };

  // Here you would update the data in Supabase
  // await supabase.from('logos').update(newLogoData).eq('id', currentLogoData.id);

  return newLogoData;
};

export const updateLogo = async (
  index: number,
  newLogoUrl: string,
  currentLogoData: LogoData,
): Promise<LogoData> => {
  // const supabase = createClient();
  console.log(`Updating logo at index ${index} to ${newLogoUrl}`);

  const newLogos = [...currentLogoData.logos];
  newLogos[index] = newLogoUrl;

  const newLogoData = {
    ...currentLogoData,
    logos: newLogos,
  };

  // Here you would update the data in Supabase
  // await supabase.from('logos').update(newLogoData).eq('id', currentLogoData.id);

  return newLogoData;
};

interface HeadlineData {
  headline: string;
}

export const headlineDataOptions = queryOptions({
  queryKey: ['headlineData'],
  queryFn: (): Promise<HeadlineData> => {
    const queryClient = new QueryClient();
    const documentData = queryClient.getQueryData<{ documentSnapshot: DocumentData }>([
      'documentData',
    ]);

    console.log('documentData', documentData);

    // Return existing data if available
    if (documentData?.documentSnapshot.headlineData) {
      return documentData.documentSnapshot.headlineData;
    }

    // Fall back to defaults
    return {
      headline: '',
    };
  },
});

export const updateHeadline = async (
  newHeadline: string,
  currentHeadlineData: HeadlineData,
): Promise<HeadlineData> => {
  // const supabase = createClient();
  console.log('Updating headline to', newHeadline);

  const newHeadlineData = {
    ...currentHeadlineData,
    headline: newHeadline,
  };

  // Here you would update the data in Supabase
  // await supabase.from('headline').update(newHeadlineData).eq('id', currentHeadlineData.id);

  return newHeadlineData;
};

export interface AddressData {
  suburb: string;
  additional: string;
  state: string;
  street: string;
}

export const addressDataOptions = queryOptions({
  queryKey: ['addressData'],
  queryFn: async (): Promise<AddressData> => {
    // const supabase = createClient();
    // Fetch address data from Supabase
    // For now, we'll return a dummy structure
    return {
      suburb: '',
      additional: '',
      state: '',
      street: '',
    };
  },
});

export const updateAddress = async (
  newAddressData: AddressData,
): Promise<AddressData> => {
  // const supabase = createClient();
  console.log('Updating address data', newAddressData);

  // Here you would update the data in Supabase
  // await supabase.from('address').update(newAddressData).eq('id', newAddressData.id);

  return newAddressData;
};

// Finance Data
export interface FinanceData {
  financeCopy: string;
  financeType: string;
  customFinanceType: string;
  financeAmount: string;
}

export const financeDataOptions = queryOptions({
  queryKey: ['financeData'],
  queryFn: async (): Promise<FinanceData> => {
    // Fetch finance data from your backend or return initial data
    return {
      financeCopy: '',
      financeType: '',
      customFinanceType: '',
      financeAmount: '',
    };
  },
});

export const updateFinanceData = async (
  newFinanceData: FinanceData,
): Promise<FinanceData> => {
  console.log('Updating finance data', newFinanceData);
  // Here you would update the data in your backend
  // For now, we'll just return the new data
  return newFinanceData;
};

// Property Copy Data
export interface PropertyCopyData {
  propertyCopy: string;
}

export const propertyCopyDataOptions = queryOptions({
  queryKey: ['propertyCopyData'],
  queryFn: async (): Promise<PropertyCopyData> => {
    // Fetch property copy data from your backend or return initial data
    return {
      propertyCopy: '',
    };
  },
});

export const updatePropertyCopyData = async (
  newPropertyCopyData: PropertyCopyData,
): Promise<PropertyCopyData> => {
  console.log('Updating property copy data', newPropertyCopyData);
  // Here you would update the data in your backend
  // For now, we'll just return the new data
  return newPropertyCopyData;
};

export interface Agent {
  name: string;
  phone: string;
}

interface AgentsData {
  agents: Agent[];
}

// Agents Data
export const agentsDataOptions = queryOptions({
  queryKey: ['agentsData'],
  queryFn: (): Promise<AgentsData> => {
    // const supabase = createClient();
    // Fetch agents data from Supabase
    // For now, we'll return a dummy structure
    return {
      agents: [],
    };
  },
});

export const updateAgents = async (
  newAgents: Agent[],
  currentAgentsData: AgentsData,
): Promise<AgentsData> => {
  // const supabase = createClient();
  console.log('Updating agents', newAgents);

  const newAgentsData = {
    ...currentAgentsData,
    agents: newAgents,
  };

  console.log('newAgentsData', newAgentsData);

  // Here you would update the data in Supabase
  // await supabase.from('agents').update(newAgentsData).eq('id', currentAgentsData.id);

  return newAgentsData;
};
export interface SaleTypeData {
  saleType: 'auction' | 'expression' | '';
  expressionOfInterest?: {
    closingTime?: string;
    closingAmPm?: 'AM' | 'PM';
    closingDate?: Date;
  };
  auctionId?: string;
}

export interface Auction {
  id: string;
  auctionDate: Date;
  auctionTime: string;
  auctionAmPm: 'AM' | 'PM';
  // Add any other relevant auction fields
}

// Sale Type Data
export const saleTypeDataOptions = queryOptions({
  queryKey: ['saleTypeData'],
  queryFn: async (): Promise<SaleTypeData> => {
    // Fetch from your backend or return initial data
    return {
      saleType: '',
    };
  },
});

export const updateSaleType = async (
  newSaleTypeData: SaleTypeData,
): Promise<SaleTypeData> => {
  // const supabase = createClient();
  console.log('Updating sale type', newSaleTypeData);

  return newSaleTypeData;
};

export interface DocumentData {
  addressData: AddressData;
  headlineData: HeadlineData;
  photoData: PhotoData;
  financeData: FinanceData;
  propertyCopyData: PropertyCopyData;
  agentsData: AgentsData;
  saleTypeData: SaleTypeData;
  logoData: LogoData;
}

export interface Property {
  id: string;
  street_number: string;
  streets: { street_name: string };
  suburbs: { suburb_name: string; postcode: string };
  states: { state_name: string; short_name: string };
  associated_agents: string[];
  property_type: string;
  lead_agent: string;
}

export interface PropertiesData {
  allProperties: Property[];
  myProperties: Property[];
  otherProperties: Property[];
}

export interface SaveDocumentError extends Error {
  toastData?: {
    title: string;
    description: string;
    variant: 'default' | 'destructive';
    action: string;
  };
}

// Function to save the document
export const savePortfolioDocument = async (
  documentId: number,
  documentData: DocumentData,
): Promise<{ documentId: number; versionNumber: number }> => {
  const supabase = createBrowserClient();

  console.log('documentData', documentData);

  console.log('documentId', documentId);

  // Fetch the current document to check ownership and editors
  const { data: currentDocument, error: fetchError } = await supabase
    .from('documents')
    .select('document_owner, editors')
    .eq('id', documentId)
    .single();

  if (fetchError) {
    console.error('Error fetching document:', fetchError);
    throw fetchError;
  }

  console.log('Current document:', currentDocument);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('Error getting user:', userError);
    throw userError;
  }

  const userId = userData.user?.id;
  console.log('Current user ID:', userId);

  const canEdit =
    currentDocument.document_owner === userId ||
    (currentDocument.editors && currentDocument.editors.includes(userId));

  console.log('Can edit:', canEdit);

  if (!canEdit) {
    throw new Error('User does not have permission to edit this document');
  }

  console.log('documentId', documentId);
  console.log('Updating document data', documentData);

  const { data: updatedDocument, error: updateError } = await supabase
    .from('documents')
    .update({ document_data: documentData })
    .eq('id', documentId)
    .single();

  if (updateError) {
    console.error('Error updating document', updateError);
    throw updateError;
  }

  console.log('updatedDocument', updatedDocument);

  const { data: latestVersion, error: versionError } = await supabase
    .from('document_history')
    .select('version_number')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single();

  if (versionError) {
    console.error('Error fetching latest version', versionError);
    throw versionError;
  }

  console.log('latestVersion', latestVersion);

  const newVersionNumber = latestVersion?.version_number
    ? latestVersion.version_number + 1
    : 1;

  const { error: insertError } = await supabase.from('document_history').insert({
    document_id: documentId,
    version_number: newVersionNumber,
    document_snapshot: documentData,
    status_id: 1,
    change_summary: 'Document update',
  });

  if (insertError) {
    console.error('Error inserting new version', insertError);
    throw insertError;
  }

  console.log('newVersionNumber', newVersionNumber);

  return { documentId, versionNumber: newVersionNumber };
};

// Mutation hook for saving the document
export const useSavePortfolioDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      documentData,
    }: {
      documentId: number;
      documentData: DocumentData;
    }) => {
      console.log('documentId', documentId);
      console.log('documentData', documentData);
      return savePortfolioDocument(documentId, documentData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['documentData', variables.documentId],
      });
    },
  });
};

// Query option for fetching property data
export const portfolioPagePropertyOptions = (selectedPropertyId: string | null) =>
  queryOptions({
    queryKey: ['portfolioPageProperty', selectedPropertyId],
    queryFn: async () => {
      if (!selectedPropertyId) return null;
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('properties')
        .select(
          `
          id,
          street_number,
          streets (street_name),
          suburbs (suburb_name),
          states (short_name),
          lead_agent
        `,
        )
        .eq('id', selectedPropertyId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedPropertyId,
  });

// Query option for fetching lead agent profile
export const leadAgentProfileOptions = (leadAgentId: string | undefined) =>
  queryOptions({
    queryKey: ['leadAgentProfile', leadAgentId],
    queryFn: () => getProfileFromID(leadAgentId || ''),
    enabled: !!leadAgentId,
  });

// Query option for fetching properties
export const propertiesOptions = () =>
  queryOptions<PropertiesData>({
    queryKey: ['properties'],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase.from('properties').select(`
          id,
          street_number,
          streets(street_name),
          suburbs(suburb_name, postcode),
          states(state_name, short_name),
          associated_agents,
          property_type,
          lead_agent
        `);

      if (error) throw new Error(`Error fetching properties: ${error.message}`);

      const allProperties = data as unknown as Property[];
      const myProperties = allProperties.filter(
        (prop) =>
          prop.lead_agent === userId || prop?.associated_agents?.includes(userId || ''),
      );
      const otherProperties = allProperties.filter(
        (prop) =>
          prop.lead_agent !== userId && !prop?.associated_agents?.includes(userId || ''),
      );

      return {
        allProperties,
        myProperties,
        otherProperties,
      } as PropertiesData;
    },
  });

const updateQueryKeys = (queryClient: QueryClient, documentSnapshot: DocumentData) => {
  // Update headline data
  queryClient.setQueryData(headlineDataOptions.queryKey, documentSnapshot.headlineData);

  // Update finance data
  queryClient.setQueryData(financeDataOptions.queryKey, documentSnapshot.financeData);

  // Update address data
  queryClient.setQueryData(addressDataOptions.queryKey, documentSnapshot.addressData);

  // Update photo data
  queryClient.setQueryData(photoDataOptions.queryKey, documentSnapshot.photoData);

  // Update property copy data
  queryClient.setQueryData(
    propertyCopyDataOptions.queryKey,
    documentSnapshot.propertyCopyData,
  );

  // Update agents data
  queryClient.setQueryData(agentsDataOptions.queryKey, documentSnapshot.agentsData);

  // Update sale type data
  queryClient.setQueryData(saleTypeDataOptions.queryKey, documentSnapshot.saleTypeData);

  // Update logo data
  queryClient.setQueryData(logoDataOptions.queryKey, documentSnapshot.logoData);
};

export const useDocumentSetup = (selectedPropertyId: string | null) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return useQuery({
    queryKey: ['documentData', selectedPropertyId],
    queryFn: async () => {
      if (!selectedPropertyId) return null;

      if (selectedPropertyId === 'sandbox') {
        // Exit early for sandbox mode
        return {
          docId: 'sandbox',
          versionNumber: 1,
          documentSnapshot: {} as DocumentData,
          canEdit: true,
          isAuthorised: true,
        };
      }

      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      const userId = user.id;

      // Fetch property data
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('id, lead_agent')
        .eq('id', selectedPropertyId)
        .single();

      if (propertyError) throw propertyError;
      if (!propertyData) throw new Error('Property not found');

      const isAuthorised = propertyData.lead_agent === userId;

      // Fetch or create document
      const documentData = await fetchOrCreateDocument(propertyData.id, isAuthorised);

      // Fetch latest version
      const latestVersionData = await fetchLatestVersion(documentData.id);

      const result = {
        docId: documentData.id,
        versionNumber: latestVersionData.version_number,
        documentSnapshot: latestVersionData.document_snapshot,
        canEdit: documentData.document_owner === userId,
        isAuthorised,
      };

      updateQueryKeys(queryClient, result.documentSnapshot);

      // Update URL parameters if necessary
      const currentDocId = searchParams.get('document');
      const currentVersion = searchParams.get('version');

      if (
        result.docId.toString() !== currentDocId ||
        result.versionNumber.toString() !== currentVersion
      ) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('document', result.docId.toString());
        newParams.set('version', result.versionNumber.toString());
        router.push(`${pathname}?${newParams.toString()}`, {
          scroll: false,
        });
      }

      return result;
    },
    enabled: !!selectedPropertyId,
  });
};

async function fetchOrCreateDocument(propertyId: string, isAuthorised: boolean) {
  const supabase = createBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user found');

  const userId = user.id;

  const { data: existingDoc, error: docError } = await supabase
    .from('documents')
    .select('id, document_owner')
    .eq('property_id', propertyId)
    .eq('document_type_id', 2)
    .single();

  if (docError && docError.code !== 'PGRST116') throw docError;

  if (existingDoc) return existingDoc;

  if (!isAuthorised) throw new Error('Not authorized to create document');

  const { data: newDoc, error: createError } = await supabase
    .from('documents')
    .insert({
      property_id: propertyId,
      document_type_id: 2,
      document_owner: userId,
    })
    .select()
    .single();

  if (createError) throw createError;

  await createInitialVersion(newDoc.id, userId);

  return newDoc;
}

async function createInitialVersion(documentId: string, userId: string) {
  const supabase = createBrowserClient();
  const { error: versionError } = await supabase.from('document_history').insert({
    document_id: documentId,
    version_number: 1,
    document_snapshot: {},
    edited_by: userId,
    change_summary: 'Initial document creation',
  });

  if (versionError) throw versionError;
}

async function fetchLatestVersion(documentId: string) {
  const supabase = createBrowserClient();
  const { data: latestVersion, error: versionError } = await supabase
    .from('document_history')
    .select('version_number, document_snapshot')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single();

  if (versionError) throw versionError;
  return latestVersion;
}
