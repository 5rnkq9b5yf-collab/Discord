"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { Server, Channel, User } from "@/lib/types";
import {
  ChevronDown, ChevronRight, Mic, MicOff, Headphones, Settings,
  Hash, Volume2, Video, Bell, Music, BarChart2, Calendar, Theater, FileText, Settings2,
} from "lucide-react";

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  text: <Hash size={15} />,
  voice: <Volume2 size={15} />,
  video: <Video size={15} />,
  announcements: <Bell size={15} />,
  music: <Music size={15} />,
  polls: <BarChart2 size={15} />,
  events: <Calendar size={15} />,
  stage: <Theater size={15} />,
  forum: <FileText size={15} />,
  custom: <Settings2 size={15} />,
};

function ChannelItem({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all duration-150 group relative",
        active ? "font-medium" : ""
      )}
      style={{
        background: active ? "var(--lyra-glass-active)" : undefined,
        backdropFilter: active ? "var(--lyra-blur-sm)" : undefined,
        WebkitBackdropFilter: active ? "var(--lyra-blur-sm)" : undefined,
        borderLeft: active ? "2px solid var(--lyra-accent)" : "2px solid transparent",
        color: active ? "var(--lyra-text-primary)" : "var(--lyra-text-muted)",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--lyra-glass-hover)";
          e.currentTarget.style.color = "var(--lyra-text-secondary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "";
          e.currentTarget.style.color = "var(--lyra-text-muted)";
        }
      }}
    >
      <span className="flex-shrink-0" style={{ color: active ? "var(--lyra-accent)" : undefined }}>
        {CHANNEL_ICONS[channel.type] ?? <Hash size={15} />}
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
  server, currentChannelId, currentUser, muted, deafened,
  onSelectChannel, onToggleMute, onToggleDeafen, onOpenSettings, onOpenProfile,
}: ChannelSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  return (
    <aside className="glass-sidebar flex flex-col w-[232px] flex-shrink-0">
      {/* Server header */}
      <button
        className="flex items-center justify-between px-4 h-12 font-semibold transition-colors"
        style={{
          borderBottom: "0.5px solid var(--lyra-border-glass)",
          color: "var(--lyra-text-primary)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
      >
        <span className="truncate">{server.name}</span>
        <ChevronDown size={16} className="flex-shrink-0" style={{ color: "var(--lyra-text-muted)" }} />
      </button>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {server.categories.map((category) => (
          <div key={category.id} className="mb-1">
            <button
              onClick={() => toggle(category.id)}
              className="flex items-center gap-1 w-full px-1 py-1 text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{ color: "var(--lyra-text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--lyra-text-secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--lyra-text-muted)"; }}
            >
              {collapsed[category.id] ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
              {category.name}
            </button>
            {!collapsed[category.id] && (
              <div className="flex flex-col gap-0.5 mt-0.5">
                {category.channels.map((ch) => (
                  <ChannelItem
                    key={ch.id}
                    channel={ch}
                    active={ch.id === currentChannelId}
                    onClick={() => onSelectChannel(ch.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User panel */}
      <div
        className="flex items-center gap-2 px-2 py-2"
        style={{
          borderTop: "0.5px solid var(--lyra-border-glass)",
          background: "var(--lyra-glass-sidebar)",
          backdropFilter: "var(--lyra-blur-sm)",
          WebkitBackdropFilter: "var(--lyra-blur-sm)",
        }}
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
            <p className="text-sm font-medium truncate leading-tight" style={{ color: "var(--lyra-text-primary)" }}>
              {currentUser.displayName}
            </p>
            <p className="text-xs truncate leading-tight" style={{ color: "var(--lyra-text-muted)" }}>
              {currentUser.customStatus || `@${currentUser.username}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {[
            { action: onToggleMute, title: muted ? "Unmute" : "Mute", active: muted, icon: muted ? <MicOff size={15} /> : <Mic size={15} /> },
            { action: onToggleDeafen, title: deafened ? "Undeafen" : "Deafen", active: deafened, icon: <Headphones size={15} /> },
            { action: onOpenSettings, title: "Settings", active: false, icon: <Settings size={15} /> },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              title={btn.title}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
              style={{
                color: btn.active ? "var(--lyra-status-dnd)" : "var(--lyra-text-muted)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = btn.active ? "var(--lyra-status-dnd)" : "var(--lyra-text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = btn.active ? "var(--lyra-status-dnd)" : "var(--lyra-text-muted)"; }}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
