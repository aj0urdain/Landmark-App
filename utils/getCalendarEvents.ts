import { createBrowserClient } from "@/utils/supabase/client";
import { parseISO, addDays, addHours } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { eventTypeInfo } from "@/utils/eventTypeInfo";

export type PortfolioEvent = {
  auctions: Auction[] | null;
  created_at: string;
  portfolio_id: number;
  magazine_print: string | null;
  signed_schedule: string | null;
  magazine_deadline: string | null;
  advertising_period_end: string | null;
  advertising_period_start: string | null;
  press_bookings: string | null;
  hsagesmh_w1: string | null;
  hsagesmh_w2: string | null;
  bcm_natives: string | null;
  afr: string | null;
  adelaide_advertiser: string | null;
};

export type Event = {
  type: keyof typeof eventTypeInfo;
  title: string;
  start_date: string;
  end_date: string | null;
  portfolio_id: number;
  details: unknown;
};

type UserProfileEvent = {
  id: string;
  first_name: string;
  last_name: string;
  birthday: string | null;
  work_anniversary: string | null;
};

type Auction = {
  start_date: string;
  auction_location: string;
};

const createEvent = (
  type: keyof typeof eventTypeInfo,
  date: string | null,
  portfolioId: number,
  details?: unknown,
  title?: string | null,
): Event | null => {
  if (!date) return null;
  const info = eventTypeInfo[type];
  return {
    type,
    title: title || info.label,
    start_date: date,
    end_date: null,
    portfolio_id: portfolioId,
    details,
  };
};

const createAFREvents = (
  originalDate: string,
  portfolioId: number,
): Event[] => {
  const events: Event[] = [];
  const baseDate = parseISO(originalDate);

  const newEvent = createEvent("afr", originalDate, portfolioId, null, "AFR");
  if (newEvent) events.push(newEvent);

  const anotherEvent = createEvent(
    "afr",
    addHours(baseDate, 24).toISOString(),
    portfolioId,
    null,
    "AFR",
  );
  if (anotherEvent) events.push(anotherEvent);

  const anotherEvent2 = createEvent(
    "afr",
    addDays(baseDate, 7).toISOString(),
    portfolioId,
    null,
    "AFR",
  );
  if (anotherEvent2) events.push(anotherEvent2);

  const anotherEvent3 = createEvent(
    "afr",
    addDays(baseDate, 8).toISOString(),
    portfolioId,
    null,
    "AFR",
  );
  if (anotherEvent3) events.push(anotherEvent3);

  return events;
};

const generateRecurringEvents = (
  userEvents: UserProfileEvent[],
  currentYear: number,
): Event[] => {
  const recurringEvents: Event[] = [];
  const yearsToGenerate = 3;

  userEvents.forEach((userEvent) => {
    for (let yearOffset = 0; yearOffset < yearsToGenerate; yearOffset++) {
      const year = currentYear + yearOffset;

      if (userEvent.birthday) {
        const originalDate = parseISO(userEvent.birthday);
        const eventDate = new Date(
          year,
          originalDate.getMonth(),
          originalDate.getDate(),
        );

        recurringEvents.push({
          type: "birthday",
          title: `${userEvent.first_name} ${userEvent.last_name}'s Birthday`,
          start_date: eventDate.toISOString(),
          end_date: null,
          portfolio_id: 0,
          details: { ...userEvent, recurring: true },
        });
      }

      if (userEvent.work_anniversary) {
        const originalDate = parseISO(userEvent.work_anniversary);
        const eventDate = new Date(
          year,
          originalDate.getMonth(),
          originalDate.getDate(),
        );

        recurringEvents.push({
          type: "work_anniversary",
          title: `${userEvent.first_name} ${userEvent.last_name}'s Work Anniversary`,
          start_date: eventDate.toISOString(),
          end_date: null,
          portfolio_id: 0,
          details: { ...userEvent, recurring: true },
        });
      }
    }
  });

  return recurringEvents;
};

export const useCalendarEvents = () => {
  const supabase = createBrowserClient();
  const currentYear = new Date().getFullYear();

  const fetchPortfolioEvents = async () => {
    const { data, error } = await supabase.rpc("get_all_portfolio_data");
    if (error) throw error;
    return data as PortfolioEvent[];
  };

  const fetchUserProfileEvents = async () => {
    const { data, error } = await supabase
      .from("user_profile_complete")
      .select("id, first_name, last_name, birthday, work_anniversary")
      .not("birthday", "is", null)
      .not("work_anniversary", "is", null);

    if (error) throw error;
    return generateRecurringEvents(data as UserProfileEvent[], currentYear);
  };

  return useQuery({
    queryKey: ["calendarEvents"],
    queryFn: async () => {
      const [portfolioEvents, userProfileEvents] = await Promise.all([
        fetchPortfolioEvents(),
        fetchUserProfileEvents(),
      ]);

      const allEvents: Event[] = [];

      portfolioEvents.forEach((portfolioEvent) => {
        if (portfolioEvent.auctions) {
          portfolioEvent.auctions.forEach((auction) => {
            const event = createEvent(
              "auction",
              auction.start_date,
              portfolioEvent.portfolio_id,
              auction,
              auction.auction_location + " Auction",
            );
            if (event) allEvents.push(event);
          });
        }

        (
          Object.keys(eventTypeInfo) as Array<keyof typeof eventTypeInfo>
        ).forEach((eventType) => {
          if (
            eventType !== "auction" &&
            eventType !== "default" &&
            eventType !== "afr" &&
            portfolioEvent[eventType as keyof PortfolioEvent]
          ) {
            const event = createEvent(
              eventType,
              portfolioEvent[eventType as keyof PortfolioEvent] as string,
              portfolioEvent.portfolio_id,
            );
            if (event) allEvents.push(event);
          }
        });

        if (portfolioEvent.afr) {
          const afrEvents = createAFREvents(
            portfolioEvent.afr,
            portfolioEvent.portfolio_id,
          );
          allEvents.push(...afrEvents);
        }

        if (
          portfolioEvent.advertising_period_start &&
          portfolioEvent.advertising_period_end
        ) {
          const event = createEvent(
            "advertising_period",
            portfolioEvent.advertising_period_start,
            portfolioEvent.portfolio_id,
          );
          if (event) {
            allEvents.push({
              ...event,
              end_date: portfolioEvent.advertising_period_end,
            });
          }
        }
      });

      allEvents.push(...userProfileEvents);

      return allEvents;
    },
  });
};
