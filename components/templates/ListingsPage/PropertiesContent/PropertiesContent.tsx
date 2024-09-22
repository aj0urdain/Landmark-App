// components/PropertiesContent.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Property {
  Id: string;
  Name: string;
  CreatedById: string;
  CreatedDate: string;
}

const useFetchProperties = () => {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProperties = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/salesforce?queryType=properties");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      if (result.records && Array.isArray(result.records)) {
        setProperties(result.records);
        console.log("Fetched properties:", result.records);
      } else {
        throw new Error("Invalid data structure received from API");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties",
      );
      console.error("Error fetching properties:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, isLoading, error, refetch: fetchProperties };
};

const PropertiesContent: React.FC = () => {
  const { properties, isLoading, error } = useFetchProperties();

  if (error) {
    return <div>Error loading properties: {error}</div>;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 py-4">
      <h1 className="mb-5 text-2xl font-bold">Properties</h1>

      {isLoading ? (
        <p>Loading properties...</p>
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.Id} className="animate-slide-down-fade-in">
              <CardHeader>
                <CardTitle>{property.Name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Created By ID:</strong> {property.CreatedById}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {new Date(property.CreatedDate).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
};

export default PropertiesContent;
