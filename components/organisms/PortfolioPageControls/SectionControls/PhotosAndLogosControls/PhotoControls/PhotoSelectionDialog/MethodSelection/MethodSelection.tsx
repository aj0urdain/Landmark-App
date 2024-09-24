import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Link, Database } from "lucide-react";

interface MethodSelectionProps {
  onSelect: (method: "upload" | "url" | "propertybase") => void;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({ onSelect }) => {
  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <Button
        variant="outline"
        onClick={() => onSelect("upload")}
        className="flex h-full items-center"
      >
        <Upload className="mr-2" /> Upload Your Own
      </Button>
      <Button
        variant="outline"
        onClick={() => onSelect("url")}
        className="flex h-full items-center"
      >
        <Link className="mr-2" /> Paste URL
      </Button>
      <Button
        variant="outline"
        onClick={() => onSelect("propertybase")}
        className="flex h-full items-center"
      >
        <Database className="mr-2" /> Select from PropertyBase
      </Button>
    </div>
  );
};

export default MethodSelection;
