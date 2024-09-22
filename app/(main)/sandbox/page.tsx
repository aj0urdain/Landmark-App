import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    title: "Document Generator",
    description: "Create custom reports and documents",
  },
  {
    title: "Chart Generator",
    description: "Visualize data with interactive charts",
  },
  {
    title: "Yield Calculator",
    description: "Compute and analyze investment yields",
  },
  {
    title: "Property Comparison",
    description: "Compare multiple properties side by side",
  },
  {
    title: "Market Trends",
    description: "Stay updated with the latest market insights",
  },
];

const SandboxPage = () => {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-2">
      {tools.map((tool) => (
        <Card key={tool.title} className="flex overflow-hidden">
          <div className="relative w-2/5">
            <Image
              src="/images/burgess-rawson-login-bg.jpg"
              alt={tool.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex w-3/5 flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{tool.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
            </CardContent>
            <div className="p-4">
              <Button className="w-full">Use Tool</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SandboxPage;
