import React from "react";
import { Mail } from "lucide-react";
import Link from "next/link";

interface EmailContactProps {
  email: string;
  size?: "small" | "medium" | "large";
}

const EmailContact: React.FC<EmailContactProps> = ({
  email,
  size = "medium",
}) => {
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
    <div className="flex items-center gap-2 text-muted-foreground">
      <Mail className={iconSizeClasses[size]} />
      <Link
        href={`mailto:${email}`}
        className={`${sizeClasses[size]} text-foreground hover:underline`}
      >
        {email}
      </Link>
    </div>
  );
};

export default EmailContact;
