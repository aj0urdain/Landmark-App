import { Event } from "@/components/molecules/CompanyCalendar/CompanyCalendar";

export const eventColors = {
  auction: {
    Melbourne: "#BF40BF",
    Brisbane: "#3498db",
    Sydney: "#e67e22",
    default: "#e74c3c",
  },
  magazine_print: "#4A90E2",
  signed_schedule: "#F5A623",
  magazine_deadline: "#D0021B",
  advertising_period: "#7ED321",
  default: "#9B9B9B",
};

export function getEventColor(event: Event): string {
  if (
    event.type === "auction" &&
    eventColors &&
    typeof eventColors.auction === "object"
  ) {
    const auctionColors = eventColors.auction;
    return event.details?.auction_location && event.details.auction_location in auctionColors
      ? auctionColors[event.details.auction_location as keyof typeof auctionColors]
      : eventColors.default;
  }
  return (
    (typeof eventColors === "object"
      ? eventColors[event.type] || eventColors.default
      : eventColors) as string
  ) || "#000000";
}

export function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
