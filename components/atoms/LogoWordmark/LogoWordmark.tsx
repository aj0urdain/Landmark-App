import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoWordmarkProps {
  className?: string;
}

export function LogoWordmark({ className }: LogoWordmarkProps) {
  return (
    <Image
      src="/images/burgess-rawson-symbol-and-wordmark.svg"
      alt="Burgess Rawson Logo"
      width={900}
      height={300}
      className={cn("h-auto w-full", className)}
    />
  );
}
