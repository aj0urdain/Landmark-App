import {
  Gavel,
  FileSignature,
  Calendar,
  Mailbox,
  Cake,
  GraduationCap,
  Briefcase,
  Book,
  Newspaper,
} from 'lucide-react';
import { Event } from '@/components/molecules/CompanyCalendar/CompanyCalendar';

export const eventTypeInfo = {
  auction: {
    icon: Gavel,
    color: 'text-blue-500',
    bgColor: {
      Melbourne: '#bb3e7e',
      Brisbane: '#81c8d6',
      Sydney: '#f18841',
      default: '#e74c3c',
    },
    label: 'Auction',
    section: 'portfolio',
  },
  magazine_print: {
    icon: Book,
    color: 'text-green-500',
    bgColor: '#9f998e',
    label: 'Magazine Print',
    section: 'portfolio',
  },
  signed_schedule: {
    icon: FileSignature,
    color: 'text-yellow-500',
    borderColor: '#9f998e',
    bgColor: '#F5A623',
    label: 'Signed Schedule',
    section: 'portfolio',
  },
  magazine_deadline: {
    icon: Calendar,
    color: 'text-red-500',
    borderColor: '#9f998e',
    bgColor: '#e7e5e3',
    label: 'Magazine Deadline',
    section: 'portfolio',
  },
  advertising_period: {
    icon: Mailbox,
    color: 'text-purple-500',
    bgColor: '#9f998e',
    label: 'Advertising Period',
    section: 'portfolio',
  },
  birthday: {
    icon: Cake,
    color: 'text-pink-500',
    bgColor: '#FF69B4',
    label: 'Birthdays',
    section: 'staff',
  },
  work_anniversary: {
    icon: Briefcase,
    color: 'text-orange-500',
    bgColor: '#FFA500',
    label: 'Work Anniversaries',
    section: 'staff',
  },
  training: {
    icon: GraduationCap,
    color: 'text-indigo-500',
    bgColor: '#4B0082',
    label: 'Training',
    section: 'company',
  },
  press_bookings: {
    icon: Newspaper,
    color: 'text-pink-500',
    bgColor: '#f3b4c7',
    label: 'Press Bookings',
    section: 'portfolio',
  },
  hsagesmh_w1: {
    icon: Newspaper,
    color: 'text-red-500',
    bgColor: '#8cbe48',
    label: 'HS/AGE/SMH W1',
    section: 'portfolio',
  },
  hsagesmh_w2: {
    icon: Newspaper,
    color: 'text-orange-500',
    bgColor: '#008f47',
    label: 'HS/AGE/SMH W2',
    section: 'portfolio',
  },
  bcm_natives: {
    icon: Newspaper,
    color: 'text-green-500',
    bgColor: '#3e83b1',
    label: 'BCM Natives',
    section: 'portfolio',
  },
  afr: {
    icon: Newspaper,
    color: 'text-purple-500',
    bgColor: '#ea7073',
    label: 'AFR',
    section: 'portfolio',
  },
  adelaide_advertiser: {
    icon: Newspaper,
    color: 'text-blue-500',
    bgColor: '#ae9057',
    label: 'Adelaide Advertiser',
    section: 'portfolio',
  },
  default: {
    icon: Calendar,
    color: 'text-gray-500',
    bgColor: '#9B9B9B',
    label: 'Default',
    section: 'company',
  },
};

export function getEventTypeInfo(eventType: string) {
  return eventTypeInfo[eventType as keyof typeof eventTypeInfo];
}

export function getEventColor(event: Event): {
  color: string;
  bgColor: string;
  borderColor?: string;
  gradientBgColors: string[];
} {
  const info = getEventTypeInfo(event.type);
  let bgColor: string;

  if (!info) {
    bgColor = '#000000'; // Default color
  } else if (event.type === 'auction' && typeof info.bgColor === 'object') {
    bgColor =
      event.details?.auction_location && event.details.auction_location in info.bgColor
        ? info.bgColor[event.details.auction_location as keyof typeof info.bgColor]
        : info.bgColor.default;
  } else {
    bgColor = typeof info.bgColor === 'string' ? info.bgColor : info.bgColor.default;
  }

  const color = info?.color || '#000000'; // Default color if info is undefined
  const borderColor = info && 'borderColor' in info ? info.borderColor : undefined;
  const gradientBgColors = generateGradientColors(bgColor);

  return { color, bgColor, borderColor, gradientBgColors };
}

export function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r.toString()}, ${g.toString()}, ${b.toString()}, ${alpha.toString()})`;
}

export function getEventTypeOptions() {
  return Object.entries(eventTypeInfo).map(([value, info]) => ({
    value,
    label: info.label,
    section: info.section,
  }));
}

export function generateGradientColors(baseColor: string): string[] {
  // Convert hex to RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  // Generate lighter color
  const lighterColor = `#${Math.min(255, r + 40)
    .toString(16)
    .padStart(2, '0')}${Math.min(255, g + 40)
    .toString(16)
    .padStart(2, '0')}${Math.min(255, b + 40)
    .toString(16)
    .padStart(2, '0')}`;

  // Generate darker color
  const darkerColor = `#${Math.max(0, r - 40)
    .toString(16)
    .padStart(2, '0')}${Math.max(0, g - 40)
    .toString(16)
    .padStart(2, '0')}${Math.max(0, b - 40)
    .toString(16)
    .padStart(2, '0')}`;

  return [lighterColor, baseColor, darkerColor];
}
