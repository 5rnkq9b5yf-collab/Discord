"use client";

import { cn } from "@/lib/utils";
import type { Badge as BadgeType } from "@/lib/types";

interface BadgeProps {
  badge: BadgeType;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ badge, size = "md", className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border select-none",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
      style={{
        backgroundColor: badge.color + "22",
        borderColor: badge.color + "55",
        color: badge.color,
      }}
      title={badge.description}
    >
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </div>
  );
}

interface BadgeRowProps {
  badges: BadgeType[];
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function BadgeRow({ badges, max = 6, size = "md", className }: BadgeRowProps) {
  const shown = badges.slice(0, max);
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((b) => (
        <Badge key={b.id} badge={b} size={size} />
      ))}
    </div>
  );
}
