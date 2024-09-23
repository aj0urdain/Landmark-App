import { createBrowserClient } from "@/utils/supabase/client";
import { getProfileFromID } from "@/utils/supabase/supabase-queries";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export interface AddressData {
  suburb: string;
  additional: string;
  state: string;
  street: string;
}

interface HeadlineData {
  headline: string;
}

interface PhotoData {
  photoCount: number;
  photos: {
    original: string | null;
    cropped: string | null; // This will be the same as original
    crop: { x: number; y: number; width: number; height: number } | null;
  }[];
}

// Finance Data
export interface FinanceData {
  financeCopy: string;
  financeType: string;
  customFinanceType: string;
  financeAmount: string;
}

// Property Copy Data
export interface PropertyCopyData {
  propertyCopy: string;
}

export interface Agent {
  name: string;
  phone: string;
}

interface AgentsData {
  agents: Agent[];
}

export interface SaleTypeData {
  saleType: "auction" | "expression" | "";
  expressionOfInterest?: {
    closingTime?: string;
    closingAmPm?: "AM" | "PM";
    closingDate?: Date;
  };
  auctionId?: string;
}

interface LogoData {
  logoCount: number;
  logoOrientation: "horizontal" | "vertical";
  logos: string[];
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

const initialDocumentData: DocumentData = {
  addressData: { suburb: "", additional: "", state: "", street: "" },
  headlineData: { headline: "" },
  photoData: { photoCount: 0, photos: [] },
  financeData: {
    financeCopy: "",
    financeType: "",
    customFinanceType: "",
    financeAmount: "",
  },
  propertyCopyData: { propertyCopy: "" },
  agentsData: { agents: [] },
  saleTypeData: { saleType: "" },
  logoData: { logoCount: 0, logoOrientation: "horizontal", logos: [] },
};

// Main query option for document data
export const documentDataOptions = (documentId: number | null) =>
  queryOptions({
    queryKey: ["documentData", documentId],
    queryFn: async () => {
      if (!documentId) return initialDocumentData;

      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("document_history")
        .select("document_snapshot, version_number")
        .eq("document_id", documentId)
        .order("version_number", { ascending: false })
        .limit(1)
        .single();

      if (error)
        throw new Error(`Error fetching document data: ${error.message}`);

      return {
        ...initialDocumentData,
        ...data.document_snapshot,
        versionNumber: data.version_number,
      } as DocumentData & { versionNumber: number };
    },
    enabled: !!documentId,
  });

// Function to set up a new document or fetch an existing one
export const setupDocument = async (propertyId: string, userId: string) => {
  const supabase = createBrowserClient();

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
    const { data: newDocument, error: insertError } = await supabase
      .from("documents")
      .insert({
        property_id: propertyId,
        document_type_id: 1,
        document_owner: userId,
        document_data: initialDocumentData,
        status_id: 1,
      })
      .select("id")
      .single();

    if (insertError)
      throw new Error(`Error creating document: ${insertError.message}`);
    documentId = newDocument.id;

    await supabase.from("document_history").insert({
      document_id: documentId,
      edited_by: userId,
      version_number: 1,
      document_snapshot: initialDocumentData,
      status_id: 1,
      change_summary: "Initial document creation",
    });
  } else {
    documentId = existingDocument.id;
  }

  const { data: latestVersion } = await supabase
    .from("document_history")
    .select("version_number")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  const result = {
    documentId: documentId,
    versionNumber: latestVersion?.version_number || 0,
  };

  queryOptions({
    queryKey: ["currentDocument"],
    queryFn: () => result,
  });

  return result;
};

// Add this new function
export const useUpdateDocumentData = () => {
  const queryClient = useQueryClient();

  return (
    documentId: number,
    updater: (prev: DocumentData) => DocumentData,
  ) => {
    queryClient.setQueryData<DocumentData>(
      ["documentData", documentId],
      (oldData) => {
        if (!oldData) return oldData;
        return updater(oldData);
      },
    );
  };
};

// Function to save the document
export const savePortfolioDocument = async (
  documentId: number,
  userId: string,
  documentData: DocumentData,
): Promise<{ documentId: number; versionNumber: number }> => {
  const supabase = createBrowserClient();

  await supabase
    .from("documents")
    .update({ document_data: documentData })
    .eq("id", documentId);

  const { data: latestVersion } = await supabase
    .from("document_history")
    .select("version_number")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  const newVersionNumber = latestVersion?.version_number + 1 || 1;

  await supabase.from("document_history").insert({
    document_id: documentId,
    edited_by: userId,
    version_number: newVersionNumber,
    document_snapshot: documentData,
    status_id: 1,
    change_summary: "Document update",
  });

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
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      return savePortfolioDocument(documentId, user.id, documentData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documentData", variables.documentId],
      });
    },
  });
};

// Query option for fetching property data
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
      return data;
    },
    enabled: !!selectedPropertyId,
  });

// Query option for fetching lead agent profile
export const leadAgentProfileOptions = (leadAgentId: string | undefined) =>
  queryOptions({
    queryKey: ["leadAgentProfile", leadAgentId],
    queryFn: () => getProfileFromID(leadAgentId || ""),
    enabled: !!leadAgentId,
  });

// Query option for fetching properties
export const propertiesOptions = () =>
  queryOptions<PropertiesData>({
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

      if (error) throw new Error(`Error fetching properties: ${error.message}`);

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

      return {
        allProperties,
        myProperties,
        otherProperties,
      } as PropertiesData;
    },
  });
