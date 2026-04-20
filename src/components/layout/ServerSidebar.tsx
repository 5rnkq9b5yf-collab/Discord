"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { Server, User } from "@/lib/types";
import { MessageCircle, Settings, Plus, Compass } from "lucide-react";

interface ServerSidebarProps {
  servers: Server[];
  currentServerId?: string;
  currentUser: User;
  onSelectServer: (id: string | "dm") => void;
  onOpenSettings: () => void;
}

function ServerIcon({ server, active, onClick }: { server: Server; active: boolean; onClick: () => void }) {
  return (
    <Tooltip content={server.name} side="right">
      <button
        onClick={onClick}
        className={cn(
          "relative group flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 select-none hover-lift",
          active
            ? "rounded-xl border border-[var(--lyra-border-glow)] shadow-[0_0_16px_var(--lyra-accent-glow)]"
            : "hover:rounded-xl"
        )}
        style={{
          background: active
            ? "var(--lyra-glass-active)"
            : "var(--lyra-glass-card)",
          backdropFilter: "var(--lyra-blur-sm)",
          WebkitBackdropFilter: "var(--lyra-blur-sm)",
          border: active ? "0.5px solid var(--lyra-border-glow)" : "0.5px solid var(--lyra-border-glass)",
          color: active ? "var(--lyra-accent)" : "var(--lyra-text-secondary)",
        }}
      >
        {server.icon ? (
          <img src={server.icon} alt={server.name} className="w-full h-full object-cover rounded-inherit" />
        ) : (
          <span className="text-lg font-bold">
            {server.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
        )}
        <span
          className={cn(
            "absolute -left-3 w-1 rounded-r-full transition-all duration-200",
            "bg-[var(--lyra-accent)]",
            active ? "h-8" : "h-0 group-hover:h-4"
          )}
        />
      </button>
    </Tooltip>
  );
}

function IconButton({ label, onClick, children, active }: { label: string; onClick?: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <Tooltip content={label} side="right">
      <button
        onClick={onClick}
        className="group flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 hover:rounded-xl hover-lift"
        style={{
          background: active ? "var(--lyra-glass-active)" : "var(--lyra-glass-card)",
          backdropFilter: "var(--lyra-blur-sm)",
          WebkitBackdropFilter: "var(--lyra-blur-sm)",
          border: "0.5px solid var(--lyra-border-glass)",
          color: "var(--lyra-text-muted)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--lyra-accent)";
          e.currentTarget.style.borderColor = "var(--lyra-border-glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--lyra-text-muted)";
          e.currentTarget.style.borderColor = "var(--lyra-border-glass)";
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
}

export function ServerSidebar({ servers, currentServerId, currentUser, onSelectServer, onOpenSettings }: ServerSidebarProps) {
  return (
    <aside
      className="glass-sidebar flex flex-col items-center py-3 gap-2 w-[68px] flex-shrink-0 overflow-y-auto"
    >
      {/* Logo */}
      <Tooltip content="Home" side="right">
        <button
          onClick={() => onSelectServer("dm")}
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 font-bold text-xl hover:rounded-xl hover-lift",
          )}
          style={{
            background: currentServerId === "dm" ? "var(--lyra-glass-active)" : "var(--lyra-glass-card)",
            backdropFilter: "var(--lyra-blur-sm)",
            WebkitBackdropFilter: "var(--lyra-blur-sm)",
            border: currentServerId === "dm" ? "0.5px solid var(--lyra-border-glow)" : "0.5px solid var(--lyra-border-glass)",
            color: "var(--lyra-accent)",
            boxShadow: currentServerId === "dm" ? "0 0 16px var(--lyra-accent-glow)" : undefined,
          }}
        >
          ♪
        </button>
      </Tooltip>

      <div className="w-8 h-px rounded my-1" style={{ background: "var(--lyra-border-glass)" }} />

      <IconButton label="Direct Messages"><MessageCircle size={22} /></IconButton>

      <div className="w-8 h-px rounded my-1" style={{ background: "var(--lyra-border-glass)" }} />

      {servers.map((server) => (
        <ServerIcon
          key={server.id}
          server={server}
          active={server.id === currentServerId}
          onClick={() => onSelectServer(server.id)}
        />
      ))}

      <IconButton label="Add a Server"><Plus size={24} /></IconButton>
      <IconButton label="Explore Servers"><Compass size={22} /></IconButton>

      <div className="flex-1" />

      <IconButton label="Settings" onClick={onOpenSettings}><Settings size={20} /></IconButton>

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
