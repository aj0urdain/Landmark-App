import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  logoDataOptions,
  updateLogo,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import LogoUpload from "./LogoUpload/LogoUpload";
import LogoUrl from "./LogoUrl/LogoUrl";
import LogoDatabase from "./LogoDatabase/LogoDatabase";

interface LogoSelectionDialogProps {
  index: number;
  logoUrl: string;
}

const LogoSelectionDialog: React.FC<LogoSelectionDialogProps> = ({
  index,
  logoUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateLogoMutation = useMutation({
    mutationFn: (newLogoUrl: string) => {
      const logoData = queryClient.getQueryData(logoDataOptions.queryKey);
      if (!logoData) throw new Error("Logo data not available");
      return updateLogo(index, newLogoUrl, logoData);
    },
    onSuccess: (newLogoData) => {
      queryClient.setQueryData(logoDataOptions.queryKey, newLogoData);
      setIsOpen(false);
    },
  });

  const handleLogoUpdate = (newLogoUrl: string) => {
    updateLogoMutation.mutate(newLogoUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`${logoUrl ? "bg-white" : "bg-slate-900"} h-20 w-full border border-slate-700`}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Logo ${index + 1}`}
              className="h-auto max-h-10 w-20 object-contain"
            />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <p className="text-xs font-bold">Add Logo</p>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-h-[800px] sm:min-h-[300px] sm:min-w-[600px] sm:max-w-[600px]">
        <h3>Add Logo</h3>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">Paste URL</TabsTrigger>
            <TabsTrigger value="database">From Database</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <LogoUpload onLogoSelect={handleLogoUpdate} />
          </TabsContent>
          <TabsContent value="url">
            <LogoUrl onLogoSelect={handleLogoUpdate} />
          </TabsContent>
          <TabsContent value="database">
            <LogoDatabase onLogoSelect={handleLogoUpdate} />
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex items-center justify-between">
          {logoUrl && (
            <Button
              variant="destructive"
              onClick={() => handleLogoUpdate("")}
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Logo
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoSelectionDialog;
