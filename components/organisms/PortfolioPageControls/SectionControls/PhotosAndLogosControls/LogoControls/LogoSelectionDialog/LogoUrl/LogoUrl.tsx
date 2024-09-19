import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LogoUrlProps {
  onLogoSelect: (logoUrl: string) => void;
}

const LogoUrl: React.FC<LogoUrlProps> = ({ onLogoSelect }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogoSelect(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        placeholder="Paste URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button type="submit">Add Logo</Button>
    </form>
  );
};

export default LogoUrl;
