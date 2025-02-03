import React from "react";

type NotificationDotProps = {
  hasUnreadMessages: boolean;
};

export function NotificationDot({ hasUnreadMessages }: NotificationDotProps) {
  if (!hasUnreadMessages) return null;

  return (
    <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
  );
}