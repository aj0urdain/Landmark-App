import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ClosingDatePicker from "../../ExpressionsOfInterest/ClosingDatePicker/ClosingDatePicker";

interface AuctionDetailsInputProps {
  auctionTime: string;
  auctionAmPm: "AM" | "PM";
  auctionDate: Date | undefined;
  auctionVenue: string;
  onTimeChange: (time: string) => void;
  onAmPmChange: (amPm: "AM" | "PM") => void;
  onDateChange: (date: Date | undefined) => void;
  onVenueChange: (venue: string) => void;
}

const AuctionDetailsInput: React.FC<AuctionDetailsInputProps> = ({
  auctionTime,
  auctionAmPm,
  auctionDate,
  auctionVenue,
  onTimeChange,
  onAmPmChange,
  onDateChange,
  onVenueChange,
}) => {
  const timeOptions = [
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="auction-time" className="text-xs text-slate-500">
          Auction Time
        </Label>
        <Select value={auctionTime} onValueChange={onTimeChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={auctionAmPm} onValueChange={onAmPmChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ClosingDatePicker
        closingDate={auctionDate}
        onDateChange={onDateChange}
      />

      <div>
        <Label htmlFor="auction-venue" className="text-xs text-slate-500">
          Auction Venue
        </Label>
        <Input
          id="auction-venue"
          value={auctionVenue}
          onChange={(e) => onVenueChange(e.target.value)}
          placeholder="Enter auction venue"
        />
      </div>
    </div>
  );
};

export default AuctionDetailsInput;
