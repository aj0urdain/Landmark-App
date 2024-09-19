import React from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (fileUrl: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      onFileSelect(fileUrl);
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
