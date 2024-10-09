import React from "react";
import ReactTimeAgo from "react-time-ago";
import { isValid } from "date-fns";

interface SafeTimeAgoProps {
  date: Date | number;
  now: number;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SafeTimeAgo error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function TimeAgoComponent({ date, now }: SafeTimeAgoProps) {
  if (!isValid(new Date(date)) || !isValid(new Date(now))) {
    console.log("Invalid date:", date, "or now:", now);
    return null;
  }

  return (
    <ReactTimeAgo date={date} locale="en-US" timeStyle="round" now={now} />
  );
}

export function SafeTimeAgo(props: SafeTimeAgoProps) {
  return (
    <ErrorBoundary>
      <TimeAgoComponent {...props} />
    </ErrorBoundary>
  );
}
