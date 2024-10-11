import {
  Gavel,
  Newspaper,
  FileSignature,
  Calendar,
  Mailbox,
  Cake,
  GraduationCap,
  Briefcase,
} from "lucide-react";

export function getEventTypeInfo(eventType: string) {
  switch (eventType) {
    case "auction":
      return { icon: Gavel, color: "text-blue-500" };
    case "magazine_print":
      return { icon: Newspaper, color: "text-green-500" };
    case "signed_schedule":
      return { icon: FileSignature, color: "text-yellow-500" };
    case "magazine_deadline":
      return { icon: Calendar, color: "text-red-500" };
    case "advertising_period":
      return { icon: Mailbox, color: "text-purple-500" };
    case "birthday":
      return { icon: Cake, color: "text-pink-500" };
    case "work_anniversary":
      return { icon: Briefcase, color: "text-orange-500" };
    case "training":
      return { icon: GraduationCap, color: "text-indigo-500" };
    default:
      return null;
  }
}
