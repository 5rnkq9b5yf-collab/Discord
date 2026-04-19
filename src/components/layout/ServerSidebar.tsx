"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { Server, User } from "@/lib/types";
import {
  MessageCircle,
  Settings,
  Plus,
  Compass,
} from "lucide-react";

interface ServerSidebarProps {
  servers: Server[];
  currentServerId?: string;
  currentUser: User;
  onSelectServer: (id: string | "dm") => void;
  onOpenSettings: () => void;
}

function ServerIcon({
  server,
  active,
  onClick,
}: {
  server: Server;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip content={server.name} side="right">
      <button
        onClick={onClick}
        className={cn(
          "relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 select-none",
          active
            ? "rounded-xl bg-[var(--lyra-accent)] text-white"
            : "bg-[var(--lyra-secondary-bg)] text-[var(--lyra-text-primary)] hover:rounded-xl hover:bg-[var(--lyra-accent)] hover:text-white"
        )}
      >
        {server.icon ? (
          <img src={server.icon} alt={server.name} className="w-full h-full object-cover rounded-inherit" />
        ) : (
          <span className="text-lg font-bold">
            {server.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </span>
        )}
        {/* Active indicator pill */}
        <span
          className={cn(
            "absolute -left-3 w-1 bg-[var(--lyra-text-primary)] rounded-r-full transition-all duration-200",
            active ? "h-9" : "h-0 group-hover:h-4"
          )}
        />
      </button>
    </Tooltip>
  );
}

export function ServerSidebar({
  servers,
  currentServerId,
  currentUser,
  onSelectServer,
  onOpenSettings,
}: ServerSidebarProps) {
  return (
    <aside
      className="flex flex-col items-center py-3 gap-2 w-[72px] flex-shrink-0 overflow-y-auto"
      style={{ background: "var(--lyra-sidebar-bg)" }}
    >
      {/* Lyra logo */}
      <Tooltip content="Home" side="right">
        <button
          onClick={() => onSelectServer("dm")}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 font-bold text-xl",
            currentServerId === "dm"
              ? "rounded-xl bg-[var(--lyra-accent)] text-white"
              : "bg-[var(--lyra-secondary-bg)] text-[var(--lyra-accent)] hover:rounded-xl hover:bg-[var(--lyra-accent)] hover:text-white"
          )}
        >
          ♪
        </button>
      </Tooltip>

      <div className="w-8 h-px bg-[var(--lyra-border)] rounded my-1" />

      {/* DMs */}
      <Tooltip content="Direct Messages" side="right">
        <button
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200
            bg-[var(--lyra-secondary-bg)] text-[var(--lyra-text-secondary)]
            hover:rounded-xl hover:bg-[var(--lyra-accent)] hover:text-white"
        >
          <MessageCircle size={22} />
        </button>
      </Tooltip>

      <div className="w-8 h-px bg-[var(--lyra-border)] rounded my-1" />

      {/* Server list */}
      {servers.map((server) => (
        <ServerIcon
          key={server.id}
          server={server}
          active={server.id === currentServerId}
          onClick={() => onSelectServer(server.id)}
        />
      ))}

      {/* Add server / explore */}
      <Tooltip content="Add a Server" side="right">
        <button
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200
            bg-[var(--lyra-secondary-bg)] text-green-400
            hover:rounded-xl hover:bg-green-500 hover:text-white"
        >
          <Plus size={24} />
        </button>
      </Tooltip>

      <Tooltip content="Explore Servers" side="right">
        <button
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200
            bg-[var(--lyra-secondary-bg)] text-[var(--lyra-text-secondary)]
            hover:rounded-xl hover:bg-[var(--lyra-accent)] hover:text-white"
        >
          <Compass size={22} />
        </button>
      </Tooltip>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <Tooltip content="Settings" side="right">
        <button
          onClick={onOpenSettings}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200
            bg-[var(--lyra-secondary-bg)] text-[var(--lyra-text-secondary)]
            hover:rounded-xl hover:bg-[var(--lyra-accent)] hover:text-white"
        >
          <Settings size={20} />
        </button>
      </Tooltip>

      {/* Current user avatar */}
      <div className="relative">
        <Avatar
          displayName={currentUser.displayName}
          src={currentUser.avatar}
          shape={currentUser.avatarShape}
          effect={currentUser.avatarEffect}
          size={40}
          status={currentUser.status}
          showStatus
          className="cursor-pointer hover:opacity-90 transition-opacity"
        />
      </div>
    </aside>
  );
}
