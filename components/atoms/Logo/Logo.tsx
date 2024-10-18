import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/images/burgess-rawson-logo.png"
      alt="Burgess Rawson Logo"
      width={900}
      height={300}
      className={cn("h-auto", className)}
    />
  );
}
