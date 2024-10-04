import React from "react";
import { Phone } from "lucide-react";
import Link from "next/link";

interface PhoneContactProps {
  phoneNumber: string;
  size?: "small" | "medium" | "large";
  label?: string;
}

const PhoneContact: React.FC<PhoneContactProps> = ({
  phoneNumber,
  size = "medium",
  label,
}) => {
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };

  const sizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const iconSizeClasses = {
    small: "h-3 w-3",
    medium: "h-4 w-4",
    large: "h-5 w-5",
  };

  return (
    <div className="flex items-center justify-start gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className={iconSizeClasses[size]} />
        {label && <span className={sizeClasses[size]}>{label}</span>}
      </div>
      <Link
        href={`tel:${phoneNumber}`}
        className={`${sizeClasses[size]} text-foreground hover:underline`}
      >
        {formatPhoneNumber(phoneNumber)}
      </Link>
    </div>
  );
};

export default PhoneContact;
