import React from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { createBrowserClient } from "@/utils/supabase/client";

interface FileUploadProps {
  onFileSelect: (fileUrl: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const supabase = createBrowserClient();

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("user_uploads")
        .upload(`${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        return;
      }

      console.log("File uploaded successfully:", data);

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from("user_uploads")
        .getPublicUrl(`${file.name}`);

      // Pass the public URL to onFileSelect

      console.log("Public URL:", urlData.publicUrl);
      onFileSelect(urlData.publicUrl);
    }
  };

  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
      <Input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={handleFileUpload}
        accept="image/*"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center">
          <Upload size={48} className="mb-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            Click to upload or drag and drop
          </span>
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
