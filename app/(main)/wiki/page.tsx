import { Dot } from "@/components/atoms/Dot/Dot";
import { LogoWordmark } from "@/components/atoms/LogoWordmark/LogoWordmark";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Component,
  GraduationCap,
  Home,
  LibraryBig,
  MapPin,
} from "lucide-react";
import React from "react";

const wikiLinks = [
  {
    name: "Home",
    icon: Home,
    href: "/wiki",
  },
  {
    name: "Library",
    icon: LibraryBig,
    href: "/wiki/library",
  },
  {
    name: "Departments",
    icon: Component,
    href: "/wiki/departments",
  },
  {
    name: "Branches",
    icon: MapPin,
    href: "/wiki/branches",
  },
  {
    name: "Learn",
    icon: GraduationCap,
    href: "/wiki/learn",
  },
];

const WikiPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <LogoWordmark className="h-10 w-auto" />
            <Dot size="small" className="mt-1 animate-pulse bg-foreground" />
            <h1 className="mt-2 font-lexia text-xl font-bold uppercase tracking-wider">
              Wiki
            </h1>
          </div>
          <div className="flex items-center gap-8">
            {wikiLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="flex items-center gap-1 p-0 px-2 transition-all duration-150 hover:border-b hover:border-b-foreground hover:bg-transparent"
              >
                <link.icon className="h-3 w-3" />
                {link.name}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Welcome to Burgess Rawson!</h2>
            <p className="text-sm text-muted-foreground">
              This is the wiki page.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WikiPage;
