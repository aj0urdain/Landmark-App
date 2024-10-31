import { createBrowserClient } from '@/utils/supabase/client';

export const API = {
  uploadImage: async (_file: File) => {
    try {
      const supabase = createBrowserClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Generate filename
      const originalName = _file.name.split('.')[0].toLowerCase();
      const fileExt = _file.name.split('.').pop();
      const fileName = `${originalName}-${user?.id ?? 'unknown'}.${fileExt ?? 'jpg'}`;
      const filePath = `${user?.id ?? 'unknown'}/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('user_uploads') // You can change this bucket name as needed
        .upload(filePath, _file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('user_uploads').getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

export default API;
