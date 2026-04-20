"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import type { Message as MessageType, Channel, User } from "@/lib/types";
import { Hash, Volume2, Bell, Pin, Users, ChevronDown, Search } from "lucide-react";

interface ChatAreaProps {
  channel: Channel;
  messages: MessageType[];
  currentUser: User;
  onClickUser: (user: User) => void;
  onSendMessage: (content: string) => void;
  showMemberPanel: boolean;
  onToggleMemberPanel: () => void;
}

function TypingIndicator({ users }: { users: string[] }) {
  if (!users.length) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-1 text-xs" style={{ color: "var(--lyra-text-muted)" }}>
      <div className="flex gap-0.5 items-end h-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--lyra-text-muted)", animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <span>{users.join(", ")} {users.length === 1 ? "is" : "are"} typing...</span>
    </div>
  );
}

function shouldShowHeader(messages: MessageType[], index: number): boolean {
  if (index === 0) return true;
  const curr = messages[index];
  const prev = messages[index - 1];
  if (curr.authorId !== prev.authorId) return true;
  return new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime() > 5 * 60 * 1000;
}

const CHANNEL_ICON: Record<string, React.ReactNode> = {
  text: <Hash size={20} />, voice: <Volume2 size={20} />, announcements: <Bell size={20} />,
  music: <span className="text-base">🎵</span>, polls: <span className="text-base">🗳️</span>,
  events: <span className="text-base">📅</span>, stage: <span className="text-base">🎭</span>,
  forum: <span className="text-base">📋</span>, video: <span className="text-base">📹</span>,
};

export function ChatArea({ channel, messages, currentUser, onClickUser, onSendMessage, showMemberPanel, onToggleMemberPanel }: ChatAreaProps) {
  const [replyTo, setReplyTo] = useState<MessageType | null>(null);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowJumpToBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  return (
    <div className="flex flex-col flex-1 min-w-0" style={{ background: "var(--lyra-chat-bg)" }}>
      {/* Header */}
      <div className="glass-header flex items-center gap-3 px-4 h-12 flex-shrink-0">
        <span style={{ color: "var(--lyra-text-muted)" }}>
          {CHANNEL_ICON[channel.type] ?? <Hash size={20} />}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm" style={{ color: "var(--lyra-text-primary)" }}>{channel.name}</h2>
          {channel.topic && (
            <p className="text-xs truncate" style={{ color: "var(--lyra-text-muted)" }}>{channel.topic}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {[
            { icon: <Pin size={17} />, title: "Pinned messages", action: undefined, active: false },
            { icon: <Users size={17} />, title: "Member list", action: onToggleMemberPanel, active: showMemberPanel },
            { icon: <Search size={17} />, title: "Search", action: undefined, active: false },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              title={btn.title}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: btn.active ? "var(--lyra-accent)" : "var(--lyra-text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = "var(--lyra-text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = btn.active ? "var(--lyra-accent)" : "var(--lyra-text-muted)"; }}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4 flex flex-col gap-0.5"
      >
        {/* Welcome */}
        <div className="px-4 mb-4 pb-4" style={{ borderBottom: "0.5px solid var(--lyra-border-glass)" }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{ background: "var(--lyra-glass-card)", border: "0.5px solid var(--lyra-border-glass)" }}
          >
            {CHANNEL_ICON[channel.type] ?? "💬"}
          </div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--lyra-text-primary)" }}>
            Welcome to #{channel.name}
          </h3>
          {channel.topic && (
            <p className="text-sm" style={{ color: "var(--lyra-text-secondary)" }}>{channel.topic}</p>
          )}
        </div>

        {messages.map((msg, i) => (
          <Message
            key={msg.id}
            message={msg}
            showHeader={shouldShowHeader(messages, i)}
            onClickUser={onClickUser}
            onReply={setReplyTo}
          />
        ))}

        <TypingIndicator users={[]} />
        <div ref={messagesEndRef} />
      </div>

      {showJumpToBottom && (
        <button
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-24 right-8 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium animate-slide-in-up"
          style={{
            background: "var(--lyra-glass-active)",
            backdropFilter: "var(--lyra-blur-sm)",
            WebkitBackdropFilter: "var(--lyra-blur-sm)",
            border: "0.5px solid var(--lyra-border-glow)",
            color: "var(--lyra-accent)",
            boxShadow: "0 0 16px var(--lyra-accent-glow)",
          }}
        >
          <ChevronDown size={13} /> Jump to bottom
        </button>
      )}

      <MessageInput
        channelName={channel.name}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
        onSend={(content) => { onSendMessage(content); setReplyTo(null); }}
      />
    </div>
  );
}
