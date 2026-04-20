"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "glass-btn-primary font-semibold",
  secondary: "font-medium",
  ghost: "bg-transparent font-medium",
  danger: "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 font-medium",
  outline: "bg-transparent font-medium",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-xl gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, icon, children, className, disabled, style, ...props },
  ref
) {
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isOutline = variant === "outline";

  const inlineStyle: React.CSSProperties = {
    ...(isSecondary ? {
      background: "var(--lyra-glass-card)",
      backdropFilter: "var(--lyra-blur-sm)",
      WebkitBackdropFilter: "var(--lyra-blur-sm)",
      border: "0.5px solid var(--lyra-border-glass)",
      color: "var(--lyra-text-primary)",
    } : {}),
    ...(isGhost ? { color: "var(--lyra-text-secondary)" } : {}),
    ...(isOutline ? {
      border: "0.5px solid var(--lyra-border-glass)",
      color: "var(--lyra-text-primary)",
    } : {}),
    ...style,
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 select-none",
        "disabled:opacity-40 disabled:cursor-not-allowed hover-lift",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        isGhost && "hover:bg-[var(--lyra-glass-hover)] hover:text-[var(--lyra-text-primary)] rounded-xl",
        isOutline && "hover:bg-[var(--lyra-glass-hover)] rounded-xl",
        className
      )}
      style={inlineStyle}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
});
