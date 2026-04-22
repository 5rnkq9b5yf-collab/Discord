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
  Trash2,
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
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all duration-100")}
      style={{
        background: reacted ? "var(--lyra-glass-active)" : "var(--lyra-glass-card)",
        borderColor: reacted ? "var(--lyra-border-glow)" : "var(--lyra-border-glass)",
        color: reacted ? "var(--lyra-accent)" : "var(--lyra-text-secondary)",
      }}
    >
      <span>{emoji}</span>
      <span>{count}</span>
    </button>
  );
}


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
            size={36}
            onClick={() => onClickUser?.(message.author)}
            className="cursor-pointer"
          />
        </div>
      ) : (
        <div className="w-9 flex-shrink-0 flex items-center justify-end">
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
          className="absolute -top-4 right-4 flex items-center gap-0.5 z-10 animate-fade-in"
          style={{
            background: "var(--lyra-glass-modal)",
            backdropFilter: "var(--lyra-blur-sm)",
            WebkitBackdropFilter: "var(--lyra-blur-sm)",
            border: "0.5px solid var(--lyra-border-glass)",
            borderRadius: 8,
            padding: "3px 4px",
          }}
        >
          {["🎉", "❤️", "✨", "👀"].map((e) => (
            <button
              key={e}
              onClick={() => onReact?.(message.id, e)}
              className="px-1 py-0.5 text-sm rounded transition-colors leading-none"
              style={{ lineHeight: 1 }}
              onMouseEnter={(ev) => { ev.currentTarget.style.background = "var(--lyra-glass-hover)"; }}
              onMouseLeave={(ev) => { ev.currentTarget.style.background = ""; }}
            >
              {e}
            </button>
          ))}
          <div style={{ width: 1, height: 14, background: "var(--lyra-border-glass)", margin: "0 2px" }} />
          <button
            onClick={() => onReply?.(message)}
            className="flex items-center justify-center w-6 h-6 rounded transition-colors"
            style={{ color: "var(--lyra-text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = "var(--lyra-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--lyra-text-muted)"; }}
            title="Reply"
          >
            <Reply size={13} />
          </button>
          <button
            className="flex items-center justify-center w-6 h-6 rounded transition-colors"
            style={{ color: "var(--lyra-text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = "var(--lyra-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--lyra-text-muted)"; }}
            title="More"
          >
            <MoreHorizontal size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
