'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Article } from '@/types/articleTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Folder, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ArticleCoverImage = ({
  article,
  editing,
}: {
  article: Article;
  editing: boolean;
}) => {
  const [previewImage, setPreviewImage] = useState<{ file?: File; url: string }>({
    url: article.cover_image ?? '',
  });
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Query for buckets
  const { data: buckets } = useQuery({
    enabled: isOpen,
    queryKey: ['storage-buckets'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('Error fetching buckets:', error);
        return [];
      }
      console.log('Buckets:', data); // Debug log
      return data;
    },
  });

  // Query for images in selected bucket
  const { data: bucketImages } = useQuery({
    queryKey: ['bucket-images', selectedBucket],
    enabled: !!selectedBucket,
    queryFn: async () => {
      const { data: files, error: listError } = await supabase.storage
        .from(selectedBucket)
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (listError) {
        console.error('Error listing files:', listError);
        return [];
      }

      console.log('Files in bucket:', files); // Debug log

      return Promise.all(
        files.map(async (file) => {
          const {
            data: { publicUrl },
          } = supabase.storage.from(selectedBucket).getPublicUrl(file.name);

          return {
            id: file.id || file.name,
            name: file.name,
            publicUrl,
          };
        }),
      );
    },
  });

  // Modify the mutation to handle both direct uploads and library selections
  const uploadMutation = useMutation({
    mutationFn: async ({ file, imageUrl }: { file?: File; imageUrl?: string }) => {
      // If we're selecting from library, just update the article
      if (imageUrl) {
        const { error: updateError } = await supabase
          .from('articles')
          .update({ cover_image: imageUrl })
          .eq('id', article.id)
          .select();

        if (updateError) throw updateError;
        return { publicUrl: imageUrl };
      }

      // Handle file upload
      if (!file) throw new Error('No file provided');

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const originalName = file.name.split('.')[0].toLowerCase();
      const fileExt = file.name.split('.').pop();
      const fileName = `${originalName}-${user?.id ?? 'unknown'}.${fileExt ?? 'jpg'}`;
      const filePath = `${user?.id ?? 'unknown'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(selectedBucket || 'user_uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(selectedBucket || 'user_uploads').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('articles')
        .update({ cover_image: publicUrl })
        .eq('id', article.id)
        .select();

      if (updateError) throw updateError;

      return { filePath, publicUrl };
    },
    onSuccess: async () => {
      // Wait for queries to be invalidated before closing
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['article', article.id.toString()] }),
        queryClient.invalidateQueries({ queryKey: ['bucket-images', selectedBucket] }),
      ]);

      // Clean up any object URLs
      if (previewImage.file) {
        URL.revokeObjectURL(previewImage.url);
      }
      setPreviewImage({ url: article.cover_image ?? '' });

      // Close dialog only after everything is complete
      setIsOpen(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage({ file, url: previewUrl });
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setPreviewImage({ url: imageUrl });
  };

  const handleUpload = async () => {
    if (!previewImage.file) return;
    await uploadMutation.mutateAsync({ file: previewImage.file });
  };

  const handleLibrarySelect = async () => {
    if (!selectedImage) return;
    await uploadMutation.mutateAsync({ imageUrl: selectedImage });
  };

  return editing ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <ImageContainer
            image={article.cover_image ?? ''}
            title={article.title}
            editing={editing}
          />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Select Cover Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="browse">Browse Library</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="h-[400px] flex flex-col">
              <div className="flex-1">
                {previewImage.file ? (
                  <div className="h-full rounded-lg border">
                    <Image
                      src={previewImage.url}
                      alt="Preview"
                      width={400}
                      height={300}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="h-full rounded-lg border flex flex-col items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="cover-image-upload"
                      disabled={uploadMutation.isPending}
                    />
                    <label
                      htmlFor="cover-image-upload"
                      className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Click to upload an image
                      </span>
                    </label>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => void handleUpload()}
                  disabled={!previewImage.file || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="browse">
            <div className="space-y-4">
              <div className="h-[400px] grid grid-cols-[200px_1fr] gap-4">
                {/* Buckets section */}
                <div className="space-y-4">
                  <div className="font-semibold">Storage Buckets</div>
                  <ScrollArea className="h-[350px] rounded-md border">
                    <div className="p-4">
                      {buckets?.map((bucket) => (
                        <Button
                          key={bucket.id}
                          variant="ghost"
                          className={`w-full justify-start ${
                            selectedBucket === bucket.name ? 'bg-accent' : ''
                          }`}
                          onClick={() => setSelectedBucket(bucket.name)}
                        >
                          <Folder className="mr-2 h-4 w-4" />
                          {bucket.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Images section */}
                <div className="space-y-4">
                  <div className="font-semibold">Images</div>
                  <ScrollArea className="h-[350px] rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {bucketImages?.map((image) => (
                        <div
                          key={image.id}
                          className={`cursor-pointer rounded-lg border p-2 ${
                            selectedImage === image.publicUrl ? 'border-primary' : ''
                          }`}
                          onClick={() => handleImageSelect(image.publicUrl)}
                        >
                          <Image
                            src={image.publicUrl}
                            alt={image.name}
                            width={80}
                            height={80}
                            className="h-20 w-20 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => void handleLibrarySelect()}
                  disabled={!selectedImage || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? 'Selecting...' : 'Select Image'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  ) : (
    <ImageContainer
      image={article?.cover_image ?? ''}
      title={article?.title ?? ''}
      editing={editing}
    />
  );
};

// Keep your existing ImageContainer component unchanged
const ImageContainer = ({
  image,
  title,
  editing,
}: {
  image: string;
  title: string;
  editing: boolean;
}) => (
  <div className="relative flex min-h-[30rem] items-end justify-start overflow-hidden rounded-3xl group">
    <Image
      src={image}
      alt={title}
      width={1000}
      height={1000}
      className="absolute left-0 top-0 h-full w-full object-cover object-center opacity-100"
    />
    <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background/10 via-background/75 to-background" />
    {editing && (
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
        <Upload className="w-12 h-12 text-white animate-bounce" />
        <p className="text-primary text-lg font-bold">Click to change cover image</p>
      </div>
    )}
  </div>
);

export default ArticleCoverImage;
