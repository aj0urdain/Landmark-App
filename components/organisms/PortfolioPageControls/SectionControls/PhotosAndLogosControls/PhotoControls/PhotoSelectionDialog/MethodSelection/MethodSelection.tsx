import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Link, Database } from "lucide-react";

interface MethodSelectionProps {
  onSelect: (method: "upload" | "url" | "propertybase") => void;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={() => onSelect("upload")} className="flex items-center">
        <Upload className="mr-2" /> Upload Your Own
      </Button>
      <Button onClick={() => onSelect("url")} className="flex items-center">
        <Link className="mr-2" /> Paste URL
      </Button>
      <Button
        onClick={() => onSelect("propertybase")}
        className="flex items-center"
      >
        <Database className="mr-2" /> Select from PropertyBase
      </Button>
    </div>
  );
};

export default MethodSelection;
