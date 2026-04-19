"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { Server, Channel, User } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  Mic,
  MicOff,
  Headphones,
  Settings,
  Hash,
  Volume2,
  Video,
  Bell,
  Music,
  BarChart2,
  Calendar,
  Theater,
  FileText,
  Settings2,
} from "lucide-react";

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  text: <Hash size={16} />,
  voice: <Volume2 size={16} />,
  video: <Video size={16} />,
  announcements: <Bell size={16} />,
  music: <Music size={16} />,
  polls: <BarChart2 size={16} />,
  events: <Calendar size={16} />,
  stage: <Theater size={16} />,
  forum: <FileText size={16} />,
  custom: <Settings2 size={16} />,
};

interface ChannelItemProps {
  channel: Channel;
  active: boolean;
  onClick: () => void;
}

function ChannelItem({ channel, active, onClick }: ChannelItemProps) {
  const isVoice = channel.type === "voice" || channel.type === "video" || channel.type === "stage";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all duration-100 group relative",
        active
          ? "bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] font-medium"
          : "text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)]/60 hover:text-[var(--lyra-text-secondary)]"
      )}
    >
      <span className={cn("flex-shrink-0", active ? "text-[var(--lyra-accent)]" : "")}>
        {CHANNEL_ICONS[channel.type] ?? <Hash size={16} />}
      </span>
      <span className="flex-1 truncate text-left">{channel.name}</span>
      {channel.mentionCount > 0 && (
        <span className="text-xs bg-[var(--lyra-status-dnd)] text-white rounded-full px-1.5 py-0.5 font-bold leading-none">
          {channel.mentionCount}
        </span>
      )}
      {channel.unread && !channel.mentionCount && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--lyra-text-primary)] flex-shrink-0" />
      )}
    </button>
  );
}

interface ChannelSidebarProps {
  server: Server;
  currentChannelId?: string;
  currentUser: User;
  muted: boolean;
  deafened: boolean;
  onSelectChannel: (id: string) => void;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export function ChannelSidebar({
  server,
  currentChannelId,
  currentUser,
  muted,
  deafened,
  onSelectChannel,
  onToggleMute,
  onToggleDeafen,
  onOpenSettings,
  onOpenProfile,
}: ChannelSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside
      className="flex flex-col w-60 flex-shrink-0"
      style={{ background: "var(--lyra-channel-sidebar-bg)" }}
    >
      {/* Server name header */}
      <button
        className="flex items-center justify-between px-4 h-12 border-b border-[var(--lyra-border)]
          hover:bg-[var(--lyra-tertiary-bg)] transition-colors font-semibold text-[var(--lyra-text-primary)]"
      >
        <span className="truncate">{server.name}</span>
        <ChevronDown size={16} className="flex-shrink-0 text-[var(--lyra-text-muted)]" />
      </button>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {server.categories.map((category) => (
          <div key={category.id} className="mb-1">
            <button
              onClick={() => toggleCategory(category.id)}
              className="flex items-center gap-1 w-full px-1 py-1 text-xs font-semibold uppercase tracking-wider
                text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-secondary)] transition-colors"
            >
              {collapsed[category.id] ? (
                <ChevronRight size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
              {category.name}
            </button>
            {!collapsed[category.id] && (
              <div className="flex flex-col gap-0.5 mt-0.5">
                {category.channels.map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    channel={channel}
                    active={channel.id === currentChannelId}
                    onClick={() => onSelectChannel(channel.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User panel at bottom */}
      <div
        className="flex items-center gap-2 px-2 py-2 border-t border-[var(--lyra-border)]"
        style={{ background: "var(--lyra-sidebar-bg)" }}
      >
        <div className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer" onClick={onOpenProfile}>
          <div className="relative flex-shrink-0">
            <Avatar
              displayName={currentUser.displayName}
              src={currentUser.avatar}
              shape={currentUser.avatarShape}
              effect={currentUser.avatarEffect}
              size={32}
            />
            <StatusIndicator
              status={currentUser.status}
              size="sm"
              className="absolute -bottom-0.5 -right-0.5 border-2 border-[var(--lyra-sidebar-bg)]"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--lyra-text-primary)] truncate leading-tight">
              {currentUser.displayName}
            </p>
            <p className="text-xs text-[var(--lyra-text-muted)] truncate leading-tight">
              {currentUser.customStatus || `@${currentUser.username}`}
            </p>
          </div>
        </div>

        {/* Voice controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onToggleMute}
            className={cn(
              "w-7 h-7 rounded flex items-center justify-center transition-colors",
              muted
                ? "text-[var(--lyra-status-dnd)] hover:bg-[var(--lyra-tertiary-bg)]"
                : "text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)]"
            )}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            onClick={onToggleDeafen}
            className={cn(
              "w-7 h-7 rounded flex items-center justify-center transition-colors",
              deafened
                ? "text-[var(--lyra-status-dnd)] hover:bg-[var(--lyra-tertiary-bg)]"
                : "text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)]"
            )}
            title={deafened ? "Undeafen" : "Deafen"}
          >
            <Headphones size={16} />
          </button>
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 rounded flex items-center justify-center transition-colors
              text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)]"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
