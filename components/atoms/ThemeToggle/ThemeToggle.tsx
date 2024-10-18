"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dot } from "../Dot/Dot";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const ICON_SIZE = 16;

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Laptop, label: "System" },
  ];

  return (
    <>
      {themeOptions.map((option) => (
        <DropdownMenuItem
          key={option.value}
          onClick={() => setTheme(option.value)}
        >
          {theme === option.value && (
            <Dot size="small" className="mr-2 animate-pulse bg-primary" />
          )}

          <option.icon
            size={ICON_SIZE}
            className={`mr-2 ${theme === option.value ? "text-accent-foreground" : "text-muted-foreground"}`}
          />
          <span
            className={
              theme === option.value
                ? "font-extrabold text-foreground"
                : "text-muted-foreground"
            }
          >
            {option.label}
          </span>
        </DropdownMenuItem>
      ))}
    </>
  );
}
