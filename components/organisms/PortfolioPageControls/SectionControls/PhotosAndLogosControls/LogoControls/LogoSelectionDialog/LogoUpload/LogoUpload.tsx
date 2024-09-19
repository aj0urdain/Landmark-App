import React from "react";
import { Input } from "@/components/ui/input";

interface LogoUploadProps {
  onLogoSelect: (logoUrl: string) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ onLogoSelect }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onLogoSelect(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return <Input type="file" onChange={handleFileUpload} />;
};

export default LogoUpload;
