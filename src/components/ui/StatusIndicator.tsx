"use client";

import { cn } from "@/lib/utils";
import type { UserStatus } from "@/lib/types";

interface StatusIndicatorProps {
  status: UserStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const STATUS_STYLES: Record<UserStatus, string> = {
  online: "bg-[var(--lyra-status-online)]",
  idle: "bg-[var(--lyra-status-idle)]",
  dnd: "bg-[var(--lyra-status-dnd)]",
  offline: "bg-[var(--lyra-status-offline)]",
  invisible: "bg-[var(--lyra-status-offline)]",
};

const SIZE_STYLES = {
  sm: "w-2.5 h-2.5 border-[1.5px]",
  md: "w-3.5 h-3.5 border-2",
  lg: "w-4 h-4 border-2",
};

export function StatusIndicator({ status, size = "md", className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "rounded-full border-[var(--lyra-sidebar-bg)] flex-shrink-0",
        STATUS_STYLES[status],
        SIZE_STYLES[size],
        status === "dnd" && "after:content-[''] after:block after:w-1/2 after:h-[2px] after:bg-[var(--lyra-sidebar-bg)] after:rounded after:mx-auto after:my-auto after:mt-[3px]",
        className
      )}
      title={status === "dnd" ? "Do Not Disturb" : status.charAt(0).toUpperCase() + status.slice(1)}
    />
  );
}
