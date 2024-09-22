import { SectionName, SectionStatus } from "@/types/portfolioControlsTypes";
import {
  Image,
  MapPin,
  DollarSign,
  FileText,
  Users,
  Tag,
  LucideIcon,
  Heading1Icon,
} from "lucide-react";

export const sectionIcons: Record<SectionName, LucideIcon> = {
  Photos: Image,
  Logos: Image,
  Headline: Heading1Icon,
  Address: MapPin,
  Finance: DollarSign,
  "Property Copy": FileText,
  Agents: Users,
  "Sale Type": Tag,
};

export const sectionStatus: Record<SectionName, SectionStatus> = {
  Photos: { necessary: 1, optional: 1 },
  Logos: { necessary: 1, optional: 1 },
  Headline: { necessary: 1, optional: 0 },
  Address: { necessary: 1, optional: 0 },
  Finance: { necessary: 2, optional: 1 },
  "Property Copy": { necessary: 0, optional: 1 },
  Agents: { necessary: 1, optional: 1 },
  "Sale Type": { necessary: 2, optional: 2 },
};
