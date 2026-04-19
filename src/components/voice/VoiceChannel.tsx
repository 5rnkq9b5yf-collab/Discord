"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/lib/types";
import {
  Mic,
  MicOff,
  Headphones,
  PhoneOff,
  Volume2,
  Music,
  Users,
  Settings,
} from "lucide-react";

interface VoiceParticipant {
  user: User;
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
}

interface VoiceChannelProps {
  channelName: string;
  participants: VoiceParticipant[];
  currentUser: User;
  onLeave: () => void;
  className?: string;
}

function ParticipantTile({ participant }: { participant: VoiceParticipant }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200",
        participant.speaking
          ? "ring-2 ring-[var(--lyra-status-online)] bg-[var(--lyra-status-online)]/10"
          : "bg-[var(--lyra-secondary-bg)]"
      )}
    >
      <div className="relative">
        <Avatar
          displayName={participant.user.displayName}
          src={participant.user.avatar}
          shape={participant.user.avatarShape}
          effect={participant.speaking ? "glow" : participant.user.avatarEffect}
          size={64}
          status={participant.user.status}
          showStatus
        />
        {/* Speaking ring */}
        {participant.speaking && (
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{ borderRadius: participant.user.avatarShape === "circle" ? "50%" : undefined }}
          />
        )}
      </div>
      <p
        className="text-xs font-semibold text-center truncate max-w-[80px]"
        style={{ color: participant.user.displayColor || "var(--lyra-text-primary)" }}
      >
        {participant.user.displayName}
      </p>
      {/* Status icons */}
      <div className="flex items-center gap-1">
        {participant.muted && (
          <span title="Muted">
            <MicOff size={12} className="text-[var(--lyra-status-dnd)]" />
          </span>
        )}
        {participant.deafened && (
          <span title="Deafened">
            <Headphones size={12} className="text-[var(--lyra-status-dnd)]" />
          </span>
        )}
        {!participant.muted && !participant.deafened && (
          <Mic size={12} className="text-[var(--lyra-text-muted)]" />
        )}
      </div>
    </div>
  );
}

export function VoiceChannel({
  channelName,
  participants,
  currentUser,
  onLeave,
  className,
}: VoiceChannelProps) {
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [showListeningParty, setShowListeningParty] = useState(false);

  return (
    <div
      className={cn("flex flex-col h-full", className)}
      style={{ background: "var(--lyra-chat-bg)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--lyra-border)]">
        <Volume2 size={20} className="text-[var(--lyra-accent)]" />
        <div>
          <h2 className="font-semibold text-[var(--lyra-text-primary)]">{channelName}</h2>
          <p className="text-xs text-[var(--lyra-text-muted)]">{participants.length} connected</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowListeningParty(!showListeningParty)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
              showListeningParty
                ? "bg-green-500 text-black font-semibold"
                : "bg-[var(--lyra-secondary-bg)] text-[var(--lyra-text-secondary)] hover:text-[var(--lyra-text-primary)]"
            )}
          >
            <Music size={14} />
            {showListeningParty ? "Listening Party Active" : "Start Listening Party"}
          </button>
        </div>
      </div>

      {/* Participants grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-wrap gap-4 justify-center">
          {participants.map((p) => (
            <ParticipantTile key={p.user.id} participant={p} />
          ))}
        </div>

        {participants.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Volume2 size={48} className="text-[var(--lyra-text-muted)] mb-3" />
            <p className="text-[var(--lyra-text-muted)] font-medium">No one else is here yet</p>
            <p className="text-xs text-[var(--lyra-text-muted)] mt-1">Click a voice channel to join</p>
          </div>
        )}
      </div>

      {/* Voice controls bar */}
      <div
        className="flex items-center justify-center gap-4 px-6 py-4 border-t border-[var(--lyra-border)]"
        style={{ background: "var(--lyra-secondary-bg)" }}
      >
        <button
          onClick={() => setMuted(!muted)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            muted
              ? "bg-[var(--lyra-status-dnd)] text-white"
              : "bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] hover:bg-[var(--lyra-accent)] hover:text-white"
          )}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={() => setDeafened(!deafened)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            deafened
              ? "bg-[var(--lyra-status-dnd)] text-white"
              : "bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] hover:bg-[var(--lyra-accent)] hover:text-white"
          )}
          title={deafened ? "Undeafen" : "Deafen"}
        >
          <Headphones size={20} />
        </button>

        <button
          onClick={onLeave}
          className="w-14 h-12 rounded-full flex items-center justify-center transition-all
            bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
          title="Leave Voice"
        >
          <PhoneOff size={20} />
        </button>

        <button
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all
            bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] hover:bg-[var(--lyra-accent)] hover:text-white"
          title="Participants"
        >
          <Users size={20} />
        </button>

        <button
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all
            bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] hover:bg-[var(--lyra-accent)] hover:text-white"
          title="Voice settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
