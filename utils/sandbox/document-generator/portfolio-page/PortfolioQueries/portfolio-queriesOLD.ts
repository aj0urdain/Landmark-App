import { Property } from "@/types/portfolioControlsTypes";
import { createBrowserClient } from "@/utils/supabase/client";
import { getProfileFromID } from "@/utils/supabase/supabase-queries";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
  queryKey: ["photoData"],
  queryFn: async (): Promise<PhotoData> => {
    // const supabase = createClient();
    // Fetch photo data from Supabase
    // For now, we'll return a dummy structure
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
  console.log("Updating photo count to", newCount);

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
  logoOrientation: "horizontal" | "vertical";
  logos: string[];
}

export const logoDataOptions = queryOptions({
  queryKey: ["logoData"],
  queryFn: async (): Promise<LogoData> => {
    // const supabase = createClient();
    // Fetch logo data from Supabase
    // For now, we'll return a dummy structure
    return {
      logoCount: 0,
      logoOrientation: "horizontal",
      logos: [""],
    };
  },
});

export const updateLogoCount = async (
  newCount: number,
  currentLogoData: LogoData,
): Promise<LogoData> => {
  // const supabase = createClient();
  console.log("Updating logo count to", newCount);

  // Create a new logos array with the new length, preserving existing data
  const newLogos = Array(Math.max(newCount, currentLogoData.logos.length))
    .fill("")
    .map((_, index) => {
      if (index < currentLogoData.logos.length) {
        // Preserve existing logo data
        return currentLogoData.logos[index];
      } else {
        // Add new empty logo slots if needed
        return "";
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
  newOrientation: "horizontal" | "vertical",
  currentLogoData: LogoData,
): Promise<LogoData> => {
  // const supabase = createClient();
  console.log("Updating logo orientation to", newOrientation);

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
  queryKey: ["headlineData"],
  queryFn: async (): Promise<HeadlineData> => {
    // const supabase = createClient();
    // Fetch headline data from Supabase
    // For now, we'll return a dummy structure
    return {
      headline: "",
    };
  },
});

export const updateHeadline = async (
  newHeadline: string,
  currentHeadlineData: HeadlineData,
): Promise<HeadlineData> => {
  // const supabase = createClient();
  console.log("Updating headline to", newHeadline);

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
  queryKey: ["addressData"],
  queryFn: async (): Promise<AddressData> => {
    // const supabase = createClient();
    // Fetch address data from Supabase
    // For now, we'll return a dummy structure
    return {
      suburb: "",
      additional: "",
      state: "",
      street: "",
    };
  },
});

export const updateAddress = async (
  newAddressData: AddressData,
): Promise<AddressData> => {
  // const supabase = createClient();
  console.log("Updating address data", newAddressData);

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
  queryKey: ["financeData"],
  queryFn: async (): Promise<FinanceData> => {
    // Fetch finance data from your backend or return initial data
    return {
      financeCopy: "",
      financeType: "",
      customFinanceType: "",
      financeAmount: "",
    };
  },
});

export const updateFinanceData = async (
  newFinanceData: FinanceData,
): Promise<FinanceData> => {
  console.log("Updating finance data", newFinanceData);
  // Here you would update the data in your backend
  // For now, we'll just return the new data
  return newFinanceData;
};

// Property Copy Data
export interface PropertyCopyData {
  propertyCopy: string;
}

export const propertyCopyDataOptions = queryOptions({
  queryKey: ["propertyCopyData"],
  queryFn: async (): Promise<PropertyCopyData> => {
    // Fetch property copy data from your backend or return initial data
    return {
      propertyCopy: "",
    };
  },
});

export const updatePropertyCopyData = async (
  newPropertyCopyData: PropertyCopyData,
): Promise<PropertyCopyData> => {
  console.log("Updating property copy data", newPropertyCopyData);
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
  queryKey: ["agentsData"],
  queryFn: async (): Promise<AgentsData> => {
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
  console.log("Updating agents", newAgents);

  const newAgentsData = {
    ...currentAgentsData,
    agents: newAgents,
  };

  // Here you would update the data in Supabase
  // await supabase.from('agents').update(newAgentsData).eq('id', currentAgentsData.id);

  return newAgentsData;
};
export interface SaleTypeData {
  saleType: "auction" | "expression" | "";
  expressionOfInterest?: {
    closingTime?: string;
    closingAmPm?: "AM" | "PM";
    closingDate?: Date;
  };
  auctionId?: string;
}

export interface Auction {
  id: string;
  auctionDate: Date;
  auctionTime: string;
  auctionAmPm: "AM" | "PM";
  // Add any other relevant auction fields
}

// Sale Type Data
export const saleTypeDataOptions = queryOptions({
  queryKey: ["saleTypeData"],
  queryFn: async (): Promise<SaleTypeData> => {
    // Fetch from your backend or return initial data
    return {
      saleType: "",
    };
  },
});

export const updateSaleType = async (
  newSaleTypeData: SaleTypeData,
): Promise<SaleTypeData> => {
  // const supabase = createClient();
  console.log("Updating sale type", newSaleTypeData);

  return newSaleTypeData;
};

export interface PropertyData {
  id: string;
  street_number: string;
  streets: { street_name: string };
  suburbs: { suburb_name: string };
  states: { short_name: string };
  lead_agent: string;
}

export const portfolioPagePropertyOptions = (
  selectedPropertyId: string | null,
) =>
  queryOptions({
    queryKey: ["portfolioPageProperty", selectedPropertyId],
    queryFn: async () => {
      if (!selectedPropertyId) return null;
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("properties")
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
        .eq("id", selectedPropertyId)
        .single();

      if (error) throw error;
      return data as unknown as PropertyData;
    },
    enabled: !!selectedPropertyId,
  });

interface SaveDocumentParams {
  documentId: number | null;
  propertyId: string;
  userId: string;
  documentData: {
    addressData: AddressData;
    headlineData: HeadlineData;
    photoData: PhotoData;
    financeData: FinanceData;
    propertyCopyData: PropertyCopyData;
    agentsData: AgentsData;
    saleTypeData: SaleTypeData;
  };
}

export const setupDocument = async (propertyId: string, userId: string) => {
  const supabase = createBrowserClient();

  // Check if document exists
  const { data: existingDocument, error: fetchError } = await supabase
    .from("documents")
    .select("id")
    .eq("property_id", propertyId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`Error fetching document: ${fetchError.message}`);
  }

  let documentId: number;

  if (!existingDocument) {
    // Create new document
    const { data: newDocument, error: insertError } = await supabase
      .from("documents")
      .insert({
        property_id: propertyId,
        document_type_id: 1,
        document_owner: userId,
        document_data: {},
        status_id: 1,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Error creating document: ${insertError.message}`);
    }

    documentId = newDocument.id;

    // Create first history entry
    const { error: historyError } = await supabase
      .from("document_history")
      .insert({
        document_id: documentId,
        edited_by: userId,
        version_number: 1,
        document_snapshot: {},
        status_id: 1,
        change_summary: "Initial document creation",
      });

    if (historyError) {
      throw new Error(
        `Error creating document history: ${historyError.message}`,
      );
    }
  } else {
    documentId = existingDocument.id;
  }

  // Fetch latest version number
  const { data: latestVersion, error: versionError } = await supabase
    .from("document_history")
    .select("version_number")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  if (versionError) {
    throw new Error(`Error fetching latest version: ${versionError.message}`);
  }

  return { documentId, versionNumber: latestVersion.version_number };
};

export const savePortfolioDocument = async ({
  documentId,
  propertyId,
  userId,
  documentData,
}: SaveDocumentParams): Promise<{
  documentId: number;
  versionNumber: number;
}> => {
  const supabase = createBrowserClient();

  // Update existing document
  const { error: updateError } = await supabase
    .from("documents")
    .update({ document_data: documentData })
    .eq("id", documentId);

  if (updateError) {
    throw new Error(`Error updating document: ${updateError.message}`);
  }

  // Get the latest version number
  const { data: latestVersion, error: versionError } = await supabase
    .from("document_history")
    .select("version_number")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  if (versionError) {
    throw new Error(`Error fetching latest version: ${versionError.message}`);
  }

  const newVersionNumber = latestVersion.version_number + 1;

  // Create new history entry
  const { error: historyError } = await supabase
    .from("document_history")
    .insert({
      document_id: documentId,
      edited_by: userId,
      version_number: newVersionNumber,
      document_snapshot: documentData,
      status_id: 1,
      change_summary: "Document update",
    });

  if (historyError) {
    throw new Error(`Error creating document history: ${historyError.message}`);
  }

  console.log("Document saved", {
    documentId: documentId || 0,
    propertyId: propertyId || 0,
    versionNumber: newVersionNumber || 0,
  });

  return { documentId: documentId || 0, versionNumber: newVersionNumber || 0 };
};

export const documentSetupOptions = (propertyId: string | null) =>
  queryOptions({
    queryKey: ["documentSetup", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;

      const supabase = createBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) throw new Error("No authenticated user found");

      // Check if document exists and user is authorized
      const { data: existingDocument, error: docError } = await supabase
        .from("documents")
        .select("id, user_id")
        .eq("property_id", propertyId)
        .single();

      if (docError && docError.code !== "PGRST116") {
        throw new Error(`Error fetching document: ${docError.message}`);
      }

      const isAuthorized = existingDocument?.user_id === userId;
      let docId: number;

      if (!existingDocument) {
        // Create new document if it doesn't exist
        const { data: newDocument, error: createError } = await supabase
          .from("documents")
          .insert({ property_id: propertyId, user_id: userId })
          .select("id")
          .single();

        if (createError) {
          throw new Error(`Error creating document: ${createError.message}`);
        }
        docId = newDocument.id;
      } else {
        docId = existingDocument.id;
      }

      // Fetch latest version with full document snapshot
      const { data: latestVersion, error: versionError } = await supabase
        .from("document_history")
        .select("*")
        .eq("document_id", docId)
        .order("version_number", { ascending: false })
        .limit(1)
        .single();

      if (versionError) {
        throw new Error(
          `Error fetching latest version: ${versionError.message}`,
        );
      }

      const documentSnapshot = latestVersion.document_snapshot || {};

      return {
        canEdit: isAuthorized,
        documentId: docId,
        versionNumber: latestVersion.version_number,
        addressData: documentSnapshot.addressData || null,
        headlineData: documentSnapshot.headlineData || null,
        photoData: documentSnapshot.photoData || null,
        financeData: documentSnapshot.financeData || null,
        propertyCopyData: documentSnapshot.propertyCopyData || null,
        agentsData: documentSnapshot.agentsData || null,
        saleTypeData: documentSnapshot.saleTypeData || null,
      };
    },
    enabled: !!propertyId,
  });

export const leadAgentProfileOptions = (leadAgentId: string | undefined) =>
  queryOptions({
    queryKey: ["leadAgentProfile", leadAgentId],
    queryFn: () => getProfileFromID(leadAgentId || ""),
    enabled: !!leadAgentId,
  });

export const propertiesOptions = () =>
  queryOptions({
    queryKey: ["properties"],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase.from("properties").select(`
        id,
        street_number,
        streets(street_name),
        suburbs(suburb_name, postcode),
        states(state_name, short_name),
        associated_agents,
        property_type,
        lead_agent
      `);

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`);
      }

      const allProperties = data as unknown as Property[];
      const myProperties = allProperties.filter(
        (prop) =>
          prop.lead_agent === userId ||
          prop?.associated_agents?.includes(userId || ""),
      );
      const otherProperties = allProperties.filter(
        (prop) =>
          prop.lead_agent !== userId &&
          !prop?.associated_agents?.includes(userId || ""),
      );

      return { allProperties, myProperties, otherProperties };
    },
  });

export interface SaveDocumentError extends Error {
  toastData?: {
    title: string;
    description: string;
    variant: "default" | "destructive";
    action: string;
  };
}

export const useSavePortfolioDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      propertyId,
      documentData,
    }: {
      documentId: number | null;
      propertyId: string;
      documentData: {
        addressData: AddressData;
        headlineData: HeadlineData;
        photoData: PhotoData;
        financeData: FinanceData;
        propertyCopyData: PropertyCopyData;
        agentsData: AgentsData;
        saleTypeData: SaleTypeData;
      };
    }) => {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      const result = await savePortfolioDocument({
        documentId,
        propertyId,
        userId: user.id,
        documentData,
      });

      return {
        ...result,
        toastData: {
          title: "Success",
          description: "Document saved successfully",
          variant: "default",
          action: "View",
        },
      };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documentSetup", variables.propertyId],
      });
    },
    onError: (error: unknown) => {
      console.error("Error saving document:", error);
      const saveError: SaveDocumentError = new Error("Failed to save document");
      saveError.toastData = {
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
        action: "Try again",
      };
      return saveError;
    },
  });
};

export const documentDataOptions = (documentId: number | null) =>
  queryOptions({
    queryKey: ["documentData", documentId],
    queryFn: async () => {
      if (!documentId) return null;

      const supabase = createBrowserClient();

      // Fetch the document and its latest history
      const { data, error } = await supabase
        .from("document_history")
        .select("document_snapshot, version_number")
        .eq("document_id", documentId)
        .order("version_number", { ascending: false })
        .limit(1)
        .single();

      if (error)
        throw new Error(`Error fetching document data: ${error.message}`);

      // Transform the document_snapshot into the required format
      const documentSnapshot = data.document_snapshot;
      return {
        addressData: documentSnapshot.addressData || null,
        headlineData: documentSnapshot.headlineData || null,
        photoData: documentSnapshot.photoData || null,
        financeData: documentSnapshot.financeData || null,
        propertyCopyData: documentSnapshot.propertyCopyData || null,
        agentsData: documentSnapshot.agentsData || null,
        saleTypeData: documentSnapshot.saleTypeData || null,
        versionNumber: data.version_number,
      };
    },
    enabled: !!documentId,
  });
