import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const LibraryPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Library</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          1. Portfolio Magazine library 2. Industry Insights reports library 3.
          Industry Snapshots library 4. Auction results library 5. Capability
          statement library 6. IM/submission
        </p>
      </CardContent>
    </Card>
  );
};

export default LibraryPage;
