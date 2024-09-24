import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

interface LogoDatabaseProps {
  onLogoSelect: (logoUrl: string) => void;
}

const databaseLogos = [
  {
    value: "guzman-y-gomez",
    label: "Guzman Y Gomez",
    url: "https://i.imgur.com/Oy0eUvg.png",
  },
  { value: "kfc", label: "KFC", url: "https://i.imgur.com/jiVKH5p.png" },
  {
    value: "mcdonalds",
    label: "McDonalds",
    url: "https://i.imgur.com/qiJX3cq.png",
  },
  {
    value: "pearl-energy",
    label: "Pearl Energy",
    url: "https://i.imgur.com/RpRAfXx.png",
  },
];

const LogoDatabase: React.FC<LogoDatabaseProps> = ({ onLogoSelect }) => {
  const [selectedLogo, setSelectedLogo] = useState<string | undefined>();

  const handleSelect = (value: string) => {
    setSelectedLogo(value);
  };

  const handleSave = () => {
    const logo = databaseLogos.find((l) => l.value === selectedLogo);
    if (logo) {
      onLogoSelect(logo.url);
    }
  };

  return (
    <div className="space-y-2">
      <Combobox
        options={databaseLogos.map((logo) => ({
          value: logo.value,
          label: logo.label,
          imageUrl: logo.url,
        }))}
        placeholder="Select logo..."
        onSelect={handleSelect}
        selectedValue={selectedLogo}
      />
      <Button onClick={handleSave} disabled={!selectedLogo}>
        Save Selection
      </Button>
    </div>
  );
};

export default LogoDatabase;
