"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { formatRelativeTime, formatExactTime } from "@/lib/utils";
import type { Message as MessageType, User } from "@/lib/types";
import {
  Smile,
  Reply,
  MoreHorizontal,
  Edit2,
  Trash2,
  Pin,
  Bookmark,
  Share2,
  Copy,
} from "lucide-react";

interface MessageProps {
  message: MessageType;
  showHeader?: boolean;
  onClickUser?: (user: User) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (message: MessageType) => void;
  className?: string;
}

function ReactionBubble({
  emoji,
  count,
  reacted,
  onClick,
}: {
  emoji: string;
  count: number;
  reacted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm border transition-all",
        reacted
          ? "bg-[var(--lyra-accent)]/20 border-[var(--lyra-accent)]/50 text-[var(--lyra-accent)]"
          : "bg-[var(--lyra-tertiary-bg)] border-[var(--lyra-border)] text-[var(--lyra-text-secondary)] hover:bg-[var(--lyra-accent)]/10 hover:border-[var(--lyra-accent)]/30"
      )}
    >
      <span>{emoji}</span>
      <span className="text-xs font-medium">{count}</span>
    </button>
  );
}

const ACTION_BUTTONS = [
  { icon: <Smile size={16} />, label: "React", action: "react" },
  { icon: <Reply size={16} />, label: "Reply", action: "reply" },
  { icon: <Edit2 size={16} />, label: "Edit", action: "edit" },
  { icon: <Pin size={16} />, label: "Pin", action: "pin" },
  { icon: <Bookmark size={16} />, label: "Bookmark", action: "bookmark" },
  { icon: <Copy size={16} />, label: "Copy", action: "copy" },
  { icon: <Trash2 size={16} />, label: "Delete", action: "delete", danger: true },
  { icon: <MoreHorizontal size={16} />, label: "More", action: "more" },
];

export function Message({
  message,
  showHeader = true,
  onClickUser,
  onReact,
  onReply,
  className,
}: MessageProps) {
  const [hovered, setHovered] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const currentUserId = "user-1"; // In real app, from auth context

  return (
    <div
      className={cn("group relative flex gap-3 px-4 py-0.5 transition-all duration-150 rounded-lg", className)}
      style={{ background: hovered ? "var(--lyra-glass-hover)" : undefined,
               backdropFilter: hovered ? "var(--lyra-blur-sm)" : undefined,
               WebkitBackdropFilter: hovered ? "var(--lyra-blur-sm)" : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar or time spacer */}
      {showHeader ? (
        <div className="flex-shrink-0 mt-0.5">
          <Avatar
            displayName={message.author.displayName}
            src={message.author.avatar}
            shape={message.author.avatarShape}
            effect={message.author.avatarEffect}
            size={40}
            onClick={() => onClickUser?.(message.author)}
            className="cursor-pointer"
          />
        </div>
      ) : (
        <div className="w-10 flex-shrink-0 flex items-center justify-end">
          {hovered && (
            <span className="text-[10px] text-[var(--lyra-text-muted)] leading-none">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {showHeader && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <button
              onClick={() => onClickUser?.(message.author)}
              className="font-semibold text-sm hover:underline transition-colors"
              style={{ color: message.author.displayColor || "var(--lyra-text-primary)" }}
            >
              {message.author.displayName}
            </button>
            <span
              className="text-[11px] text-[var(--lyra-text-muted)] cursor-default"
              onMouseEnter={() => setShowTime(true)}
              onMouseLeave={() => setShowTime(false)}
              title={formatExactTime(message.createdAt)}
            >
              {showTime
                ? formatExactTime(message.createdAt)
                : formatRelativeTime(message.createdAt)}
            </span>
            {message.editedAt && (
              <span className="text-[11px] text-[var(--lyra-text-muted)] italic">(edited)</span>
            )}
            {message.pinned && (
              <span className="text-[11px] text-[var(--lyra-accent)]">📌</span>
            )}
          </div>
        )}

        {/* Reply context */}
        {message.replyTo && (
          <div className="flex items-center gap-2 mb-1 text-sm text-[var(--lyra-text-muted)] border-l-2 border-[var(--lyra-border)] pl-2 hover:border-[var(--lyra-accent)] transition-colors cursor-pointer">
            <Avatar
              displayName={message.replyTo.author.displayName}
              src={message.replyTo.author.avatar}
              size={16}
              shape="circle"
            />
            <span
              className="font-medium"
              style={{ color: message.replyTo.author.displayColor || "var(--lyra-text-secondary)" }}
            >
              {message.replyTo.author.displayName}
            </span>
            <span className="truncate">{message.replyTo.content}</span>
          </div>
        )}

        {/* Message text */}
        <p className="text-sm text-[var(--lyra-text-primary)] leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {message.reactions.map((reaction, i) => (
              <ReactionBubble
                key={i}
                emoji={reaction.emoji}
                count={reaction.count}
                reacted={reaction.userIds.includes(currentUserId)}
                onClick={() => onReact?.(message.id, reaction.emoji)}
              />
            ))}
            <button
              className="inline-flex items-center justify-center w-7 h-6 rounded-full
                bg-[var(--lyra-tertiary-bg)] border border-[var(--lyra-border)]
                text-[var(--lyra-text-muted)] hover:text-[var(--lyra-accent)] transition-colors text-sm"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Action bar on hover */}
      {hovered && (
        <div
          className="absolute right-4 -top-4 flex items-center gap-0.5 rounded-xl p-0.5 z-10 animate-fade-in glass-surface"
        >
          {ACTION_BUTTONS.slice(0, 6).map((btn) => (
            <button
              key={btn.action}
              onClick={() => {
                if (btn.action === "reply") onReply?.(message);
              }}
              className={cn(
                "w-7 h-7 rounded flex items-center justify-center transition-colors",
                btn.danger
                  ? "text-[var(--lyra-text-muted)] hover:bg-red-500/20 hover:text-red-400"
                  : "text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)]"
              )}
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
