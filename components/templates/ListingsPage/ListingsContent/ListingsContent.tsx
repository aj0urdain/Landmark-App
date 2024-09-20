// components/ListingsContent.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Portfolio {
  Id: string;
  Name: string;
}

interface Listing {
  Id: string;
  Name: string;
  pba__ListingType__c: string;
  pba__Status__c: string;
  CreatedDate: string;
}

const useFetchPortfolios = () => {
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPortfolios = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/salesforce?queryType=portfolios");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      setPortfolios(result.records);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch portfolios",
      );
      // console.error("Error fetching portfolios:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  return { portfolios, isLoading, error, refetch: fetchPortfolios };
};

const useFetchListings = () => {
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchListings = React.useCallback(async (portfolioId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/salesforce?queryType=listingsByPortfolios&portfolioId=${portfolioId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch listings");
      const data = await response.json();
      setListings(data.records);
    } catch (err) {
      setError("Failed to fetch listings");
      // console.error("Error fetching listings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { listings, isLoading, error, fetchListings };
};

const ListingsContent: React.FC = () => {
  const {
    portfolios,
    // isLoading: portfoliosLoading,
    error: portfoliosError,
  } = useFetchPortfolios();
  const {
    listings,
    isLoading: listingsLoading,
    error: listingsError,
    fetchListings,
  } = useFetchListings();
  const [selectedPortfolio, setSelectedPortfolio] = React.useState("");

  const handlePortfolioChange = (portfolioId: string) => {
    setSelectedPortfolio(portfolioId);
    fetchListings(portfolioId);
  };

  if (portfoliosError) {
    return <div>Error loading portfolios: {portfoliosError}</div>;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 py-4">
      <h1 className="mb-5 text-2xl font-bold">Listings</h1>

      <div className="mb-5 flex space-x-4">
        <Select onValueChange={handlePortfolioChange} value={selectedPortfolio}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a portfolio" />
          </SelectTrigger>
          <SelectContent>
            {portfolios.map((portfolio) => (
              <SelectItem key={portfolio.Id} value={portfolio.Id}>
                {portfolio.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {listingsError && <div>Error loading listings: {listingsError}</div>}

      {listingsLoading ? (
        <p>Loading listings...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.Id} className="animate-slide-down-fade-in">
              <CardHeader>
                <CardTitle>{listing.Name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Listing Type:</strong> {listing.pba__ListingType__c}
                </p>
                <p>
                  <strong>Status:</strong> {listing.pba__Status__c}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {new Date(listing.CreatedDate).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsContent;
