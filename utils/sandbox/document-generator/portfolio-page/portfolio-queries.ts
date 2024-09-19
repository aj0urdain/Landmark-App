import { queryOptions } from "@tanstack/react-query";
// import { createClient } from "@/utils/supabase/client";

interface PhotoData {
  photoCount: number;
  photos: {
    original: string | null;
    cropped: string | null;
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
      logoCount: 1,
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
  saleType: string;
  auctionLocation?: string;
  closingTime?: string;
  closingAmPm?: "AM" | "PM";
  closingDate?: Date;
  auctionTime?: string;
  auctionAmPm?: "AM" | "PM";
  auctionDate?: Date;
  auctionVenue?: string;
}

// Sale Type Data
export const saleTypeDataOptions = queryOptions({
  queryKey: ["saleTypeData"],
  queryFn: async (): Promise<SaleTypeData> => {
    // const supabase = createClient();
    // Fetch sale type data from Supabase
    // For now, we'll return a dummy structure
    return {
      saleType: "",
      auctionLocation: "",
      closingTime: "",
      closingAmPm: "AM",
      closingDate: new Date(),
    };
  },
});

export const updateSaleType = async (
  newSaleTypeData: SaleTypeData,
): Promise<SaleTypeData> => {
  // const supabase = createClient();
  console.log("Updating sale type", newSaleTypeData);

  // Here you would update the data in Supabase
  // await supabase.from('saleType').update(newSaleTypeData).eq('id', currentSaleTypeData.id);

  return newSaleTypeData;
};
