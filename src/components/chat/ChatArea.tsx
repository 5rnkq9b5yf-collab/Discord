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
    <div className="flex items-center gap-2 px-4 py-1 text-xs text-[var(--lyra-text-muted)]">
      <div className="flex gap-0.5 items-end h-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 bg-[var(--lyra-text-muted)] rounded-full"
            style={{ animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <span>
        {users.join(", ")} {users.length === 1 ? "is" : "are"} typing...
      </span>
    </div>
  );
}

function JumpToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-8 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-[var(--lyra-accent)] text-white text-xs font-medium shadow-lg
        hover:opacity-90 transition-all animate-slide-in-up"
    >
      <ChevronDown size={14} />
      Jump to bottom
    </button>
  );
}

function shouldShowHeader(messages: MessageType[], index: number): boolean {
  if (index === 0) return true;
  const curr = messages[index];
  const prev = messages[index - 1];
  if (curr.authorId !== prev.authorId) return true;
  const currTime = new Date(curr.createdAt).getTime();
  const prevTime = new Date(prev.createdAt).getTime();
  return currTime - prevTime > 5 * 60 * 1000; // 5 minutes
}

export function ChatArea({
  channel,
  messages,
  currentUser,
  onClickUser,
  onSendMessage,
  showMemberPanel,
  onToggleMemberPanel,
}: ChatAreaProps) {
  const [replyTo, setReplyTo] = useState<MessageType | null>(null);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowJumpToBottom(!nearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const CHANNEL_ICON: Record<string, React.ReactNode> = {
    text: <Hash size={20} />,
    voice: <Volume2 size={20} />,
    announcements: <Bell size={20} />,
    music: <span className="text-base">🎵</span>,
    polls: <span className="text-base">🗳️</span>,
    events: <span className="text-base">📅</span>,
    stage: <span className="text-base">🎭</span>,
    forum: <span className="text-base">📋</span>,
    video: <span className="text-base">📹</span>,
  };

  return (
    <div className="flex flex-col flex-1 min-w-0" style={{ background: "var(--lyra-chat-bg)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 h-12 border-b border-[var(--lyra-border)] flex-shrink-0"
        style={{ background: "var(--lyra-chat-bg)" }}
      >
        <span className="text-[var(--lyra-text-muted)]">
          {CHANNEL_ICON[channel.type] ?? <Hash size={20} />}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-[var(--lyra-text-primary)] text-sm">{channel.name}</h2>
          {channel.topic && (
            <p className="text-xs text-[var(--lyra-text-muted)] truncate">{channel.topic}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="w-8 h-8 flex items-center justify-center rounded text-[var(--lyra-text-muted)]
              hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)] transition-colors"
            title="Pinned messages"
          >
            <Pin size={18} />
          </button>
          <button
            onClick={onToggleMemberPanel}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded transition-colors",
              showMemberPanel
                ? "text-[var(--lyra-text-primary)] bg-[var(--lyra-tertiary-bg)]"
                : "text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)]"
            )}
            title="Member list"
          >
            <Users size={18} />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded text-[var(--lyra-text-muted)]
              hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)] transition-colors"
            title="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4 flex flex-col gap-0.5"
      >
        {/* Channel welcome */}
        <div className="px-4 mb-4 pb-4 border-b border-[var(--lyra-border)]">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{ background: "var(--lyra-secondary-bg)" }}>
            {CHANNEL_ICON[channel.type] ?? "💬"}
          </div>
          <h3 className="text-2xl font-bold text-[var(--lyra-text-primary)] mb-1">
            Welcome to #{channel.name}
          </h3>
          {channel.topic && (
            <p className="text-[var(--lyra-text-secondary)] text-sm">{channel.topic}</p>
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

      {showJumpToBottom && <JumpToBottomButton onClick={scrollToBottom} />}

      {/* Input */}
      <MessageInput
        channelName={channel.name}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
        onSend={(content) => {
          onSendMessage(content);
          setReplyTo(null);
        }}
      />
    </div>
  );
}
