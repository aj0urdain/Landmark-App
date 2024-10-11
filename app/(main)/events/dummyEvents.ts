import { addDays, addMonths, setHours, setMinutes } from "date-fns";

// Define the Event type
export type Event = {
  id: number;
  title: string;
  start_date: string;
  end_date?: string;
  event_type: "holiday" | "meeting" | "conference" | "auction" | "advertising" | "open_house" | "training" | "property_launch";
  description?: string;
  location?: string;
  event_span: "single" | "multiple";
};

// Define the priority order for event types
export const eventTypePriority: Record<Event["event_type"], number> = {
  holiday: 1,
  conference: 2,
  auction: 3,
  meeting: 4,
  property_launch: 5,
  open_house: 6,
  training: 7,
  advertising: 8
};

// Helper function to create a timestamp
const createTimestamp = (date: Date, hours: number, minutes: number) => {
  return setMinutes(setHours(date, hours), minutes).toISOString();
};

// Sample events
export const events: Event[] = [
  {
    id: 1,
    title: "New Year's Day",
    start_date: createTimestamp(addDays(new Date(), 1), 0, 0),
    event_type: "holiday",
    event_span: "single",
  },
  {
    id: 2,
    title: "Quarterly Team Meeting",
    start_date: createTimestamp(addDays(new Date(), 7), 9, 0),
    event_type: "meeting",
    description: "Review Q4 performance and set Q1 goals",
    location: "Main Conference Room",
    event_span: "single",
  },
  {
    id: 3,
    title: "Annual Real Estate Conference",
    start_date: createTimestamp(addDays(new Date(), 30), 9, 0),
    end_date: createTimestamp(addDays(new Date(), 32), 9, 0),
    event_type: "conference",
    description: "Network with industry leaders and learn about market trends",
    location: "City Convention Center",
    event_span: "multiple", 
  },
  {
    id: 4,
    title: "Spring Property Auction",
    start_date: createTimestamp(addMonths(new Date(), 2), 9, 0),
    event_type: "auction",
    description: "Auction of premium properties",
    location: "Grand Ballroom, Luxury Hotel",
    event_span: "single",
  },
  {
    id: 5,
    title: "New Listing Ad Campaign Launch",
    start_date: createTimestamp(addDays(new Date(), 14), 9, 0),
    event_type: "advertising",
    description: "Launch online and print ad campaign for new luxury listings",
    event_span: "single",
  },
  {
    id: 6,
    title: "Open House - Seaside Villa",
    start_date: createTimestamp(addDays(new Date(), 10), 9, 0),
    event_type: "open_house",
    description: "Showcase the new beachfront property to potential buyers",
    location: "123 Coastal Drive",
    event_span: "single",
  },
  {
    id: 7,
    title: "Real Estate Market Analysis Workshop",
    start_date: createTimestamp(addMonths(new Date(), 1), 9, 0),
    event_type: "training",
    description: "Training session on latest market analysis techniques",
    location: "Training Center, HQ",
    event_span: "single",
  },
  {
    id: 8,
    title: "Summer Estates Collection Launch",
    start_date: createTimestamp(addMonths(new Date(), 3), 9, 0),
    event_type: "property_launch",
    description: "Unveiling our exclusive summer property collection",
    location: "Sunset Terrace, Beach Resort",
    event_span: "single",
  },
  {
    id: 9,
    title: "Company Picnic",
    start_date: createTimestamp(addMonths(new Date(), 4), 9, 0),
    event_type: "holiday",
    description: "Annual company picnic and team building event",
    location: "City Park",
    event_span: "single",
  },
  {
    id: 10,
    title: "Luxury Property Showcase",
    start_date: createTimestamp(addMonths(new Date(), 5), 9, 0),
    end_date: createTimestamp(addMonths(new Date(), 5 + 2), 9, 0),
    event_type: "open_house",
    description: "Week-long showcase of our most luxurious properties",
    location: "Various Locations",
    event_span: "multiple",
  },
  {
    id: 11,
    title: "Real Estate Tech Innovation Summit",
    start_date: createTimestamp(addMonths(new Date(), 6), 9, 0),
    end_date: createTimestamp(addMonths(new Date(), 6 + 1), 9, 0),
    event_type: "conference",
    description: "Explore the latest in real estate technology",
    location: "Tech Center",
    event_span: "multiple",
  },
  {
    id: 12,
    title: "Fall Property Auction",
    start_date: createTimestamp(addMonths(new Date(), 8), 9, 0),
    event_type: "auction",
    description: "Auction of diverse property portfolio",
    location: "City Auction House",
    event_span: "single",
  },
  {
    id: 13,
    title: "Holiday Homes Special Promotion",
    start_date: createTimestamp(addMonths(new Date(), 10), 9, 0),
    end_date: createTimestamp(addMonths(new Date(), 11), 9, 0),
    event_type: "advertising",
    description: "Special promotion for holiday home buyers",
    event_span: "multiple",
  },
  {
    id: 14,
    title: "End-of-Year Team Celebration",
    start_date: createTimestamp(addMonths(new Date(), 11), 9, 0),
    event_type: "holiday",
    description: "Celebrate the year's achievements",
    location: "Grand Ballroom, City Hotel",
    event_span: "single",
  },
  {
    id: 15,
    title: "New Year Property Outlook Seminar",
    start_date: createTimestamp(addMonths(new Date(), 12), 9, 0),
    event_type: "meeting",
    description: "Present market outlook for the coming year to clients",
    location: "Company Auditorium",
    event_span: "single",
  },
];

// Define styles for each event type
export const eventColors: Record<string, string> = {
  holiday: "#ff4d4f",
  meeting: "#f89c28",
  conference: "#cd4f9d",
  auction: "#52c41a",
  advertising: "#93d4eb",
  open_house: "#36cfc9",
  training: "#7cb305",
  property_launch: "#9254de",
};