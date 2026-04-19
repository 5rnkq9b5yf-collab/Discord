"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/lib/types";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  LayoutGrid,
  Maximize2,
  Users,
  MessageSquare,
} from "lucide-react";

interface VideoParticipant {
  user: User;
  muted: boolean;
  cameraOff: boolean;
  speaking: boolean;
  isLocal: boolean;
}

interface VideoCallProps {
  channelName: string;
  participants: VideoParticipant[];
  currentUser: User;
  onLeave: () => void;
  className?: string;
}

type ViewMode = "grid" | "speaker";

function VideoTile({
  participant,
  large = false,
}: {
  participant: VideoParticipant;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden flex items-center justify-center",
        participant.speaking && "ring-2 ring-[var(--lyra-status-online)]",
        large ? "aspect-video" : "aspect-video"
      )}
      style={{ background: "var(--lyra-secondary-bg)" }}
    >
      {/* Video off — show avatar */}
      {participant.cameraOff ? (
        <div className="flex flex-col items-center gap-2">
          <Avatar
            displayName={participant.user.displayName}
            src={participant.user.avatar}
            shape={participant.user.avatarShape}
            size={large ? 80 : 48}
          />
          <p className="text-xs text-[var(--lyra-text-muted)]">Camera off</p>
        </div>
      ) : (
        /* Simulated video — gradient placeholder */
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${participant.user.displayColor || "var(--lyra-accent)"}40, transparent)`,
          }}
        >
          <div className="flex items-center justify-center h-full">
            <Camera size={large ? 40 : 24} className="opacity-20" />
          </div>
        </div>
      )}

      {/* Name label */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-black/50 text-white backdrop-blur-sm">
          {participant.muted && <MicOff size={10} className="text-red-400" />}
          <span>{participant.user.displayName}</span>
          {participant.isLocal && <span className="opacity-60">(you)</span>}
        </div>
      </div>

      {/* Speaking indicator */}
      {participant.speaking && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-[var(--lyra-status-online)] pointer-events-none animate-pulse" />
      )}
    </div>
  );
}

export function VideoCall({
  channelName,
  participants,
  currentUser,
  onLeave,
  className,
}: VideoCallProps) {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showChat, setShowChat] = useState(false);

  const activeSpeaker = participants.find((p) => p.speaking) ?? participants[0];

  return (
    <div
      className={cn("flex flex-col h-full", className)}
      style={{ background: "var(--lyra-primary-bg)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--lyra-border)]">
        <Camera size={18} className="text-[var(--lyra-accent)]" />
        <h2 className="font-semibold text-[var(--lyra-text-primary)] text-sm">{channelName}</h2>
        <span className="text-xs text-[var(--lyra-text-muted)] px-2 py-0.5 rounded-full bg-[var(--lyra-secondary-bg)]">
          {participants.length} participants
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "speaker" : "grid")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-colors
              bg-[var(--lyra-secondary-bg)] text-[var(--lyra-text-secondary)] hover:text-[var(--lyra-text-primary)]"
          >
            <LayoutGrid size={13} />
            {viewMode === "grid" ? "Grid" : "Speaker"} View
          </button>
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {viewMode === "grid" ? (
          <div
            className="grid gap-3 h-full"
            style={{
              gridTemplateColumns:
                participants.length === 1
                  ? "1fr"
                  : participants.length <= 4
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
            }}
          >
            {participants.map((p) => (
              <VideoTile key={p.user.id} participant={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 h-full">
            {/* Large speaker */}
            {activeSpeaker && (
              <div className="flex-1">
                <VideoTile participant={activeSpeaker} large />
              </div>
            )}
            {/* Small strip */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {participants
                .filter((p) => p.user.id !== activeSpeaker?.user.id)
                .map((p) => (
                  <div key={p.user.id} className="w-40 flex-shrink-0">
                    <VideoTile participant={p} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className="flex items-center justify-center gap-3 px-6 py-4 border-t border-[var(--lyra-border)]"
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
          onClick={() => setCameraOff(!cameraOff)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            cameraOff
              ? "bg-[var(--lyra-status-dnd)] text-white"
              : "bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] hover:bg-[var(--lyra-accent)] hover:text-white"
          )}
          title={cameraOff ? "Turn on camera" : "Turn off camera"}
        >
          {cameraOff ? <CameraOff size={20} /> : <Camera size={20} />}
        </button>

        <button
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all
            bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] hover:bg-[var(--lyra-accent)] hover:text-white"
          title="Share screen"
        >
          <Monitor size={20} />
        </button>

        <button
          onClick={onLeave}
          className="w-14 h-12 rounded-full flex items-center justify-center transition-all
            bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
          title="Leave call"
        >
          <PhoneOff size={20} />
        </button>

        <button
          onClick={() => setShowChat(!showChat)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            showChat
              ? "bg-[var(--lyra-accent)] text-white"
              : "bg-[var(--lyra-tertiary-bg)] text-[var(--lyra-text-primary)] hover:bg-[var(--lyra-accent)] hover:text-white"
          )}
          title="Chat"
        >
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );
}
