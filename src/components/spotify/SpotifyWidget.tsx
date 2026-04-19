"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SpotifyTrack } from "@/lib/types";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface SpotifyWidgetProps {
  track?: SpotifyTrack;
  compact?: boolean;
  showControls?: boolean;
  className?: string;
}

function VinylAnimation() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <div className="w-10 h-10 rounded-full animate-spin-slow flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1e1e1e 0%, #333 50%, #1e1e1e 100%)" }}>
        <div className="w-4 h-4 rounded-full bg-[var(--lyra-primary-bg)] flex items-center justify-center">
          <Music size={8} className="text-green-400" />
        </div>
      </div>
    </div>
  );
}

export function SpotifyWidget({ track, compact = false, showControls = false, className }: SpotifyWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(track?.isPlaying ?? false);

  if (!track) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-xl", className)}
        style={{ background: "var(--lyra-secondary-bg)" }}>
        <VinylAnimation />
        <div>
          <p className="text-xs font-semibold text-[var(--lyra-text-muted)]">Not listening to anything</p>
          <p className="text-xs text-[var(--lyra-text-muted)] opacity-60">Connect Spotify to share music</p>
        </div>
      </div>
    );
  }

  const progressPercent = (track.progress / track.duration) * 100;
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg", className)}
        style={{ background: "var(--lyra-secondary-bg)" }}>
        <div className="w-8 h-8 rounded-md bg-[var(--lyra-tertiary-bg)] flex items-center justify-center flex-shrink-0">
          <Music size={14} className="text-green-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--lyra-text-primary)] truncate">{track.name}</p>
          <p className="text-xs text-[var(--lyra-text-muted)] truncate">{track.artist}</p>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className={cn("p-3 rounded-xl space-y-2", className)}
      style={{ background: "var(--lyra-secondary-bg)" }}>
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Music size={12} className="text-green-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)]">
          Listening to Spotify
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-auto" />
      </div>

      {/* Track info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-[var(--lyra-tertiary-bg)] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <Music size={20} className="text-green-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--lyra-text-primary)] truncate">{track.name}</p>
          <p className="text-xs text-[var(--lyra-text-muted)] truncate">{track.artist}</p>
          <p className="text-xs text-[var(--lyra-text-muted)]/60 truncate">{track.album}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1 rounded-full bg-[var(--lyra-tertiary-bg)] overflow-hidden">
          <div
            className="h-full rounded-full bg-green-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[var(--lyra-text-muted)]">
          <span>{formatTime(track.progress)}</span>
          <span>{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Controls (premium feature mockup) */}
      {showControls && (
        <div className="flex items-center justify-center gap-3 pt-1">
          <button className="text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors">
            <SkipBack size={16} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full flex items-center justify-center
              bg-green-500 text-black hover:bg-green-400 transition-colors"
          >
            {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" />}
          </button>
          <button className="text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors">
            <SkipForward size={16} />
          </button>
          <button className="text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors ml-2">
            <Volume2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
