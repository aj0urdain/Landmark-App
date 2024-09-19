import React from "react";
import { Input } from "@/components/ui/input";

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlSubmit }) => {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Paste image URL here"
        onBlur={(e) => onUrlSubmit(e.target.value)}
      />
      <p className="text-sm text-gray-500">
        Supported file types: .jpg, .jpeg, .png, .gif
      </p>
    </div>
  );
};

export default UrlInput;
