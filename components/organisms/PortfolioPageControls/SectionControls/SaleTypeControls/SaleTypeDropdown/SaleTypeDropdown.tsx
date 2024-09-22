import React, { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saleTypeDataOptions,
  updateSaleType,
  SaleTypeData,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Gavel, MailQuestion } from "lucide-react";
import { Label } from "@/components/ui/label";

const SaleTypeDropdown = () => {
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  const updateSaleTypeMutation = useMutation({
    mutationFn: (newSaleTypeData: SaleTypeData) =>
      updateSaleType(newSaleTypeData),
    onSuccess: (newData) => {
      queryClient.setQueryData(["saleTypeData"], newData);
    },
  });

  useEffect(() => {
    if (triggerRef.current) {
      setMenuWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  const handleSaleTypeSelect = (saleType: "auction" | "expression") => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      saleType,
    });
  };

  const getDisplayContent = () => {
    switch (saleTypeData?.saleType) {
      case "auction":
        return (
          <>
            <Gavel className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Auction
          </>
        );
      case "expression":
        return (
          <>
            <MailQuestion className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Expression of Interest
          </>
        );
      default:
        return "Select Sale Type";
    }
  };

  return (
    <div className="flex w-full flex-col space-y-0.5">
      <Label htmlFor="sale-type" className="ml-2 text-xs text-slate-500">
        Sale Type
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={false}
            className="w-full justify-between"
          >
            <div className="flex items-center">{getDisplayContent()}</div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ width: menuWidth }} className="w-full">
          <DropdownMenuItem onClick={() => handleSaleTypeSelect("auction")}>
            <Gavel className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Auction
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaleTypeSelect("expression")}>
            <MailQuestion className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Expression of Interest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SaleTypeDropdown;
