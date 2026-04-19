"use client";

import { cn } from "@/lib/utils";
import type { AvatarShape } from "@/lib/types";
import { StatusIndicator } from "./StatusIndicator";
import type { UserStatus } from "@/lib/types";

export const AVATAR_EFFECTS = [
  { id: "none", label: "None" },
  { id: "sparkle", label: "Sparkle Trail" },
  { id: "glow", label: "Golden Glow" },
  { id: "neon", label: "Neon Pulse" },
  { id: "rainbow", label: "Rainbow Border" },
  { id: "particles", label: "Particle Burst" },
  { id: "galaxy", label: "Galaxy Swirl" },
  { id: "fire", label: "Fire Aura" },
  { id: "snow", label: "Snow Particles" },
];

interface AvatarProps {
  src?: string;
  alt?: string;
  displayName?: string;
  shape?: AvatarShape;
  effect?: string;
  size?: number | "sm" | "md" | "lg" | "xl" | "2xl";
  status?: UserStatus;
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
  "2xl": 80,
};

const EFFECT_STYLES: Record<string, string> = {
  sparkle: "ring-2 ring-[var(--lyra-accent)] ring-offset-1 ring-offset-[var(--lyra-sidebar-bg)]",
  glow: "shadow-[0_0_12px_3px_gold] ring-2 ring-yellow-400",
  neon: "animate-neon-pulse ring-2 ring-[var(--lyra-accent)]",
  rainbow: "animate-rainbow-border ring-2 ring-red-500",
  particles: "ring-2 ring-purple-400 shadow-[0_0_10px_2px_purple]",
  galaxy: "ring-2 ring-indigo-400 animate-spin-slow ring-offset-1",
  fire: "ring-2 ring-orange-500 shadow-[0_0_12px_4px_orange]",
  snow: "ring-2 ring-blue-200 shadow-[0_0_8px_2px_#bfdbfe]",
};

function getInitials(displayName?: string, username?: string): string {
  const name = displayName || username || "?";
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "#7c3aed", "#c084fc", "#38bdf8", "#4ade80",
    "#fb7185", "#fbbf24", "#f97316", "#34d399",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function Avatar({
  src,
  alt,
  displayName,
  shape = "circle",
  effect = "none",
  size = "md",
  status,
  showStatus = false,
  className,
  onClick,
}: AvatarProps) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const shapeClass = shape === "circle" ? "rounded-full" : shape === "square" ? "rounded-lg" : "rounded-[30%]";
  const effectClass = EFFECT_STYLES[effect] ?? "";

  const bgColor = getAvatarColor(displayName || alt || "?");

  return (
    <div
      className={cn("relative flex-shrink-0", onClick && "cursor-pointer", className)}
      style={{ width: px, height: px }}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt || displayName || "avatar"}
          className={cn("w-full h-full object-cover", shapeClass, effectClass)}
          style={{ width: px, height: px }}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center text-white font-semibold select-none",
            shapeClass,
            effectClass
          )}
          style={{ backgroundColor: bgColor, fontSize: px * 0.38, width: px, height: px }}
        >
          {getInitials(displayName)}
        </div>
      )}
      {showStatus && status && (
        <StatusIndicator
          status={status}
          size={px <= 32 ? "sm" : "md"}
          className="absolute -bottom-0.5 -right-0.5 border-2 border-[var(--lyra-sidebar-bg)]"
        />
      )}
    </div>
  );
}
