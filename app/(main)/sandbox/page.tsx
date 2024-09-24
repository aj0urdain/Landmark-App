"use client";

import React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const tools = [
  {
    title: "Document Generator",
    description: "Create custom reports and documents",
    link: "/sandbox/document-generator/portfolio-page",
    disabled: false,
  },
  {
    title: "Chart Generator",
    description: "Visualize data with interactive charts",
    disabled: true,
  },
  {
    title: "Yield Calculator",
    description: "Compute and analyze investment yields",
    disabled: true,
  },
  {
    title: "Property Comparison",
    description: "Compare multiple properties side by side",
    disabled: true,
  },
  {
    title: "Market Trends",
    description: "Stay updated with the latest market insights",
    disabled: true,
  },
];

const SandboxPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/sandbox/document-generator/portfolio-page");
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-2">
      {tools.map((tool) => (
        <Card key={tool.title} className="flex h-[200px] overflow-hidden p-6">
          <div className="flex w-full flex-col justify-between">
            <div className="flex flex-col gap-2">
              <h1
                className={`text-xl font-bold ${
                  tool.disabled ? "text-muted" : ""
                }`}
              >
                {tool.title}
              </h1>

              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
            </div>
            <div>
              <Button
                onClick={() => handleClick()}
                variant="outline"
                disabled={tool.disabled}
              >
                {tool.disabled ? "Coming Soon" : "Use Tool"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SandboxPage;
