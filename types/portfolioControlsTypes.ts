export type SectionName =
  | "Photos"
  | "Logos"
  | "Headline"
  | "Address"
  | "Finance"
  | "Property Copy"
  | "Agents"
  | "Sale Type";

export type SectionStatus = {
  necessary: number;
  optional: number;
};

export interface Property {
  id: string;
  street_number: string;
  streets: { street_name: string };
  suburbs: { suburb_name: string; postcode: string };
  states: { state_name: string; short_name: string };
  associated_agents: string[];
  property_type: string;
  lead_agent: string;
}
