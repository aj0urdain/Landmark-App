// app/(main)/listings/page.tsx
"use client";

import ErrorBoundary from "@/components/templates/ErrorBoundary/ErrorBoundary";
import ListingsContent from "@/components/templates/ListingsPage/ListingsContent/ListingsContent";
import React from "react";

const FallbackUI = () => (
  <div className="p-4">
    <h1 className="mb-4 text-2xl font-bold">Oops! Something went wrong.</h1>
    <p>We&apos;re having trouble loading this page. Please try again later.</p>
  </div>
);

export default function ListingsPage() {
  return (
    <ErrorBoundary fallback={<FallbackUI />}>
      <ListingsContent />
    </ErrorBoundary>
  );
}
