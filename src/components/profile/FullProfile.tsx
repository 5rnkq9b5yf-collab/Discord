"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { BadgeRow } from "@/components/ui/Badge";
import { IdentityTagRow } from "@/components/ui/IdentityTag";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/types";
import { MessageCircle, UserPlus, ExternalLink, Music, Link, X } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  online: "Online",
  idle: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
  invisible: "Offline",
};

interface FullProfileProps {
  user: User;
  onClose: () => void;
  onMessage?: () => void;
  onAddFriend?: () => void;
}

export function FullProfile({ user, onClose, onMessage, onAddFriend }: FullProfileProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-[var(--lyra-border)] animate-slide-in-up"
        style={{ background: "var(--lyra-primary-bg)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center
            bg-black/40 text-white hover:bg-black/60 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Banner */}
        <div
          className="h-48 w-full"
          style={{
            background: user.banner
              ? `url(${user.banner}) center/cover`
              : `linear-gradient(135deg, var(--lyra-button-primary) 0%, var(--lyra-accent) 60%, #f472b6 100%)`,
          }}
        >
          {/* Animated overlay */}
          <div className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                animation: "float 5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Avatar area */}
        <div className="px-6 -mt-14 mb-4">
          <div className="flex items-end justify-between">
            <div className="p-1.5 rounded-full" style={{ background: "var(--lyra-primary-bg)" }}>
              <div className="relative">
                <Avatar
                  displayName={user.displayName}
                  src={user.avatar}
                  shape={user.avatarShape}
                  effect={user.avatarEffect}
                  size={100}
                />
                <StatusIndicator
                  status={user.status}
                  size="lg"
                  className="absolute bottom-1 right-1 border-2 border-[var(--lyra-primary-bg)]"
                />
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <Button variant="primary" size="sm" icon={<MessageCircle size={14} />} onClick={onMessage}>
                Message
              </Button>
              <Button variant="secondary" size="sm" icon={<UserPlus size={14} />} onClick={onAddFriend}>
                Add Friend
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-6 pb-8 grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 space-y-5">
            {/* Name + pronouns + tags */}
            <div>
              <h2
                className="text-3xl font-bold"
                style={{
                  color: user.displayColor || "var(--lyra-text-primary)",
                  fontFamily: user.displayFont || "inherit",
                }}
              >
                {user.displayName}
              </h2>
              <p className="text-[var(--lyra-text-muted)] text-sm mt-0.5">@{user.username}</p>
              {user.pronouns && (
                <p className="text-[var(--lyra-text-secondary)] text-sm mt-0.5">{user.pronouns}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <StatusIndicator status={user.status} size="sm" />
                <span className="text-sm text-[var(--lyra-text-secondary)]">
                  {user.customStatus || STATUS_LABEL[user.status]}
                </span>
              </div>
              {user.identityTags.length > 0 && (
                <IdentityTagRow tags={user.identityTags} className="mt-2" />
              )}
            </div>

            {/* About me */}
            {user.bio && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)] mb-2">
                  About Me
                </h4>
                <div
                  className="text-sm text-[var(--lyra-text-secondary)] leading-relaxed whitespace-pre-wrap p-3 rounded-lg"
                  style={{ background: "var(--lyra-secondary-bg)" }}
                >
                  {user.bio}
                </div>
              </div>
            )}

            {/* Custom links */}
            {user.customLinks.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)] mb-2">
                  Links
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.customLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors
                        text-[var(--lyra-accent)] hover:bg-[var(--lyra-secondary-bg)]"
                    >
                      <Link size={12} />
                      {link.label}
                      <ExternalLink size={10} className="opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - widgets */}
          <div className="space-y-4">
            {/* Badges */}
            {user.badges.length > 0 && (
              <div
                className="p-3 rounded-xl"
                style={{ background: "var(--lyra-secondary-bg)" }}
              >
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)] mb-2">
                  Badges
                </h4>
                <BadgeRow badges={user.badges} />
              </div>
            )}

            {/* Member since */}
            <div
              className="p-3 rounded-xl"
              style={{ background: "var(--lyra-secondary-bg)" }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)] mb-1">
                Member Since
              </h4>
              <p className="text-sm text-[var(--lyra-text-primary)]">
                {new Date(user.joinedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Spotify */}
            {user.spotifyConnected && user.nowPlaying && (
              <div
                className="p-3 rounded-xl"
                style={{ background: "var(--lyra-secondary-bg)" }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Music size={12} className="text-green-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)]">
                    Listening To
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-md flex-shrink-0 bg-[var(--lyra-tertiary-bg)] flex items-center justify-center"
                  >
                    🎵
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--lyra-text-primary)] truncate">
                      {user.nowPlaying.name}
                    </p>
                    <p className="text-xs text-[var(--lyra-text-muted)] truncate">
                      {user.nowPlaying.artist}
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 rounded-full bg-[var(--lyra-tertiary-bg)]">
                  <div
                    className="h-full rounded-full bg-green-400 transition-all"
                    style={{
                      width: `${(user.nowPlaying.progress / user.nowPlaying.duration) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
