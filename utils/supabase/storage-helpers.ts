'use server';

import { createServerClient } from './server';

type UploadResult = {
  folderPath: string;
  fileName: string;
  fullPath: string;
  error: Error | null;
};

export async function uploadFile(
  file: File,
  {
    bucketName,
    userId,
    resourceType,
  }: {
    bucketName: string;
    userId: string;
    resourceType: string;
  },
): Promise<UploadResult> {
  try {
    const supabase = await createServerClient();
    // Create folder path based on userId and resourceType
    const folderPath = `${userId}/${resourceType}`;

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    // Full path including folder and filename
    const fullPath = `${folderPath}/${fileName}`;

    const { error } = await supabase.storage.from(bucketName).upload(fullPath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw error;

    return {
      folderPath,
      fileName,
      fullPath,
      error: null,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      folderPath: '',
      fileName: '',
      fullPath: '',
      error: error as Error,
    };
  }
}

// Helper to get public URL
export async function getPublicUrl(bucketName: string, path: string): Promise<string> {
  const supabase = await createServerClient();
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);

  return data.publicUrl;
}
