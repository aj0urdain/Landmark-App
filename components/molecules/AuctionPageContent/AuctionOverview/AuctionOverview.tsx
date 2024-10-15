import React from "react";
import { Card } from "@/components/ui/card";
const AuctionOverview = () => {
  return (
    <div className="grid h-full grid-cols-12 gap-4">
      <Card className="col-span-8 flex h-full w-full flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">
            This auction is for the portfolio of properties located in the city
            of Melbourne.
          </p>
        </div>
      </Card>
      <Card className="col-span-4 flex h-full w-full flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">
            This auction is for the portfolio of properties located in the city
            of Melbourne.
          </p>
        </div>
      </Card>
      <Card className="col-span-6 flex h-full w-full flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">
            This auction is for the portfolio of properties located in the city
            of Melbourne.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuctionOverview;
