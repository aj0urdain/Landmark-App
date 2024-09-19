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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Gavel, MailQuestion, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { auctionDetails } from "@/lib/auctionDetails";

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

  const handleSaleTypeAndLocationSelect = (
    saleType: string,
    location?: string,
  ) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      saleType,
      auctionLocation: location,
    });
  };

  const displayText =
    saleTypeData?.saleType === "auction"
      ? `Auction - ${saleTypeData.auctionLocation || "Select Location"}`
      : saleTypeData?.saleType === "expression"
        ? "Expressions of Interest"
        : "Select Sale Type";

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
            className="w-full justify-between capitalize"
          >
            <div className="flex items-center justify-start">
              {saleTypeData?.saleType === "auction" && (
                <Gavel className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              )}
              {saleTypeData?.saleType === "expression" && (
                <MailQuestion className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              )}
              {displayText}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ width: menuWidth }} className="w-full">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="w-full">
              <Gavel className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              Auction
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              style={{ width: menuWidth }}
              className="w-full"
            >
              {auctionDetails.map((location) => (
                <DropdownMenuItem
                  className="w-full"
                  key={location.value}
                  onClick={() =>
                    handleSaleTypeAndLocationSelect("auction", location.value)
                  }
                >
                  <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  {location.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => handleSaleTypeAndLocationSelect("expression")}
          >
            <MailQuestion className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Expressions of Interest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SaleTypeDropdown;
