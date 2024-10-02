"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Speech,
  BrainCog,
  Newspaper,
  MapPinHouse,
  Rss,
  SquareCheckBig,
  WandSparkles,
} from "lucide-react";

const createLinks = [
  {
    name: "Task",
    icon: SquareCheckBig,
    href: "/create/task",
  },
  {
    name: "Property",
    icon: MapPinHouse,
    href: "/create/property",
  },
  {
    name: "Blog Post",
    icon: Rss,
    href: "/create/blog-post",
  },
  {
    name: "News Article",
    icon: Newspaper,
    href: "/create/news-article",
  },
  {
    name: "Announcement",
    icon: Speech,
    href: "/create/announcement",
  },
  {
    name: "Tutorial",
    icon: BrainCog,
    href: "/create/tutorial",
  },
];

const CreateMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="sticky -top-4 z-50 bg-gradient-to-b from-transparent via-background/50 to-background backdrop-blur-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <WandSparkles className="h-4 w-4" />
            <h1 className="text-xl font-bold">Create</h1>
          </div>
          <div className="flex items-center gap-8">
            {createLinks.map((link) => (
              <Button
                onClick={() => {
                  router.push(link.href);
                }}
                key={link.name}
                variant="ghost"
                className={cn(
                  "flex items-center gap-1 p-0 px-2 transition-all duration-150",
                  pathname === link.href ||
                    (pathname.startsWith(`${link.href}/`) &&
                      link.href !== "/create")
                    ? "border-b-2 border-foreground text-foreground hover:bg-transparent"
                    : "text-muted-foreground hover:border-b-2 hover:border-foreground hover:bg-transparent hover:text-foreground",
                )}
              >
                <link.icon className="h-3 w-3" />
                {link.name}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
    </div>
  );
};

export default CreateMenu;
