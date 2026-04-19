"use client";

import { cn } from "@/lib/utils";
import type { IdentityTag as IdentityTagType } from "@/lib/types";

interface IdentityTagProps {
  tag: IdentityTagType;
  onRemove?: () => void;
  className?: string;
}

export function IdentityTag({ tag, onRemove, className }: IdentityTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border select-none",
        className
      )}
      style={{
        backgroundColor: tag.color + "22",
        borderColor: tag.color + "55",
        color: tag.color,
      }}
    >
      {tag.label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label={`Remove ${tag.label} tag`}
        >
          ×
        </button>
      )}
    </span>
  );
}

interface IdentityTagRowProps {
  tags: IdentityTagType[];
  onRemove?: (id: string) => void;
  className?: string;
}

export function IdentityTagRow({ tags, onRemove, className }: IdentityTagRowProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map((tag) => (
        <IdentityTag
          key={tag.id}
          tag={tag}
          onRemove={onRemove ? () => onRemove(tag.id) : undefined}
        />
      ))}
    </div>
  );
}
