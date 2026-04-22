"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { BadgeRow } from "@/components/ui/Badge";
import { IdentityTagRow } from "@/components/ui/IdentityTag";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/types";
import { MessageCircle, UserPlus, ExternalLink } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  online: "Online",
  idle: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
  invisible: "Offline",
};

interface ProfileCardProps {
  user: User;
  position?: { x: number; y: number };
  onClose: () => void;
  onViewFullProfile?: () => void;
  onMessage?: () => void;
  onAddFriend?: () => void;
}

export function ProfileCard({
  user,
  position,
  onClose,
  onViewFullProfile,
  onMessage,
  onAddFriend,
}: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Adjust position to stay within viewport
  const style: React.CSSProperties = position
    ? {
        position: "fixed",
        top: Math.min(position.y, window.innerHeight - 500),
        left: Math.min(position.x, window.innerWidth - 320),
        zIndex: 100,
      }
    : { position: "relative" };

  return (
    <div
      ref={cardRef}
      className="w-76 rounded-2xl overflow-hidden animate-scale-in glass-modal"
      style={{ ...style, width: 300 }}
    >
      {/* Banner */}
      <div
        className="h-20 w-full relative"
        style={{
          background: user.banner
            ? `url(${user.banner}) center/cover`
            : `linear-gradient(135deg, var(--lyra-accent) 0%, var(--lyra-button-primary) 100%)`,
        }}
      />

      {/* Avatar + name */}
      <div className="px-4 pb-1 relative">
        <div className="flex justify-between items-start">
          <div className="relative -mt-8 mb-2">
            <div className="p-1 rounded-full" style={{ background: "var(--lyra-primary-bg)" }}>
              <Avatar
                displayName={user.displayName}
                src={user.avatar}
                shape={user.avatarShape}
                effect={user.avatarEffect}
                size={72}
              />
            </div>
            <StatusIndicator
              status={user.status}
              size="lg"
              className="absolute bottom-1 right-1 border-2 border-[var(--lyra-primary-bg)]"
            />
          </div>
          <button
            onClick={onViewFullProfile}
            className="mt-2 text-xs text-[var(--lyra-text-muted)] hover:text-[var(--lyra-accent)] transition-colors flex items-center gap-1"
            title="View Full Profile"
          >
            <ExternalLink size={12} />
            Full Profile
          </button>
        </div>

        <div className="mb-2">
          <h3
            className="text-lg font-bold leading-tight"
            style={{
              color: user.displayColor || "var(--lyra-text-primary)",
              fontFamily: user.displayFont || "inherit",
            }}
          >
            {user.displayName}
          </h3>
          <p className="text-sm text-[var(--lyra-text-muted)]">@{user.username}</p>
          {user.pronouns && (
            <p className="text-xs text-[var(--lyra-text-muted)] mt-0.5">{user.pronouns}</p>
          )}
        </div>

        {user.identityTags.length > 0 && (
          <IdentityTagRow tags={user.identityTags} className="mb-2" />
        )}

        {/* Status */}
        <div className="flex items-center gap-1.5 mb-2">
          <StatusIndicator status={user.status} size="sm" />
          <span className="text-xs text-[var(--lyra-text-secondary)]">
            {user.customStatus || STATUS_LABEL[user.status]}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--lyra-border-glass)] my-2" />

        {/* Bio */}
        {user.bio && (
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)] mb-1">
              About Me
            </p>
            <p className="text-sm text-[var(--lyra-text-secondary)] leading-relaxed line-clamp-3">
              {user.bio}
            </p>
          </div>
        )}

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="mb-2">
            <BadgeRow badges={user.badges} size="sm" />
          </div>
        )}

        {/* Join date */}
        {user.privacy.joinDate !== "nobody" && (
          <div className="mb-2">
            <p className="text-xs text-[var(--lyra-text-muted)]">
              Member since{" "}
              <span className="text-[var(--lyra-text-secondary)]">
                {new Date(user.joinedAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}

        {/* Spotify now playing */}
        {user.spotifyConnected && user.nowPlaying && (
          <>
            <div className="h-px my-2" style={{ background: "var(--lyra-border-glass)" }} />
            <div className="rounded-xl p-2.5 mb-2" style={{ background: "rgba(30,215,96,0.12)", border: "0.5px solid rgba(30,215,96,0.25)" }}>
              <p className="text-[10px] font-semibold mb-1.5" style={{ color: "#1ed760", letterSpacing: "0.05em" }}>♫ LISTENING TO SPOTIFY</p>
              <p className="text-xs font-semibold text-[var(--lyra-text-primary)] truncate">{user.nowPlaying.name}</p>
              <p className="text-[11px] text-[var(--lyra-text-muted)] truncate mb-1.5">{user.nowPlaying.artist}</p>
              <div className="h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(100, (user.nowPlaying.progress / user.nowPlaying.duration) * 100)}%`, background: "#1ed760" }}
                />
              </div>
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pb-3 pt-1">
          <Button
            variant="primary"
            size="sm"
            icon={<MessageCircle size={14} />}
            onClick={onMessage}
            className="flex-1"
          >
            Message
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<UserPlus size={14} />}
            onClick={onAddFriend}
            className="flex-1"
          >
            Add Friend
          </Button>
        </div>
      </div>
    </div>
  );
}
