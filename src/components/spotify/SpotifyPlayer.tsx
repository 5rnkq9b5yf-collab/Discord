"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SpotifyTrack } from "@/lib/types";
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  ChevronUp,
  ListMusic,
  X,
} from "lucide-react";

const MOCK_QUEUE: SpotifyTrack[] = [
  {
    id: "t1",
    name: "Espresso",
    artist: "Sabrina Carpenter",
    album: "Short n' Sweet",
    albumArt: "",
    duration: 175000,
    progress: 62000,
    isPlaying: true,
  },
  {
    id: "t2",
    name: "feelslikeimfallinginlove",
    artist: "Coldplay",
    album: "Moon Music",
    albumArt: "",
    duration: 210000,
    progress: 0,
    isPlaying: false,
  },
  {
    id: "t3",
    name: "Too Sweet",
    artist: "Hozier",
    album: "Too Sweet",
    albumArt: "",
    duration: 237000,
    progress: 0,
    isPlaying: false,
  },
  {
    id: "t4",
    name: "Beautiful Things",
    artist: "Benson Boone",
    album: "Beautiful Things",
    albumArt: "",
    duration: 199000,
    progress: 0,
    isPlaying: false,
  },
];

interface SpotifyPlayerProps {
  onClose?: () => void;
  className?: string;
}

export function SpotifyPlayer({ onClose, className }: SpotifyPlayerProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [volume, setVolume] = useState(80);

  const current = MOCK_QUEUE[0];
  const progressPercent = (current.progress / current.duration) * 100;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "glass-sidebar transition-all duration-300 border-t-0",
        className
      )}
    >
      {/* Mini player (always visible) */}
      <div className="flex items-center gap-3 px-4 py-2">
        {/* Album art */}
        <div
          className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center relative cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #1db954 0%, #0f9d3c 100%)" }}
          onClick={() => setExpanded(!expanded)}
        >
          <Music size={20} className="text-white" />
          <div className="absolute -top-1 -right-1">
            {isPlaying && (
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse border border-[var(--lyra-sidebar-bg)]" />
            )}
          </div>
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--lyra-text-primary)] truncate">{current.name}</p>
          <p className="text-xs text-[var(--lyra-text-muted)] truncate">{current.artist}</p>
          {/* Mini progress bar */}
          <div className="mt-1.5 h-0.5 rounded-full bg-[var(--lyra-tertiary-bg)]">
            <div
              className="h-full rounded-full bg-green-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="w-7 h-7 flex items-center justify-center rounded text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors"
          >
            <SkipBack size={15} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-black hover:bg-[var(--lyra-accent)] hover:text-white transition-colors"
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center rounded text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors"
          >
            <SkipForward size={15} />
          </button>
        </div>

        {/* Queue toggle */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded transition-colors",
            showQueue
              ? "text-[var(--lyra-accent)] bg-[var(--lyra-accent)]/10"
              : "text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)]"
          )}
          title="Queue"
        >
          <ListMusic size={15} />
        </button>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-7 h-7 flex items-center justify-center rounded text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors"
        >
          <ChevronUp size={15} className={cn("transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {/* Queue panel */}
      {showQueue && (
        <div
          className="border-t border-[var(--lyra-border-glass)] p-3 space-y-1 max-h-48 overflow-y-auto animate-slide-in-up glass"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)] mb-2">
            Queue
          </p>
          {MOCK_QUEUE.map((track, i) => (
            <div
              key={track.id}
              className={cn(
                "flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors",
                i === 0
                  ? "bg-[var(--lyra-glass-card)] text-[var(--lyra-text-primary)]"
                  : "hover:bg-[var(--lyra-glass-hover)] text-[var(--lyra-text-secondary)]"
              )}
            >
              <div className="w-7 h-7 rounded flex items-center justify-center text-xs bg-[var(--lyra-tertiary-bg)]">
                {i === 0 && isPlaying ? <Music size={12} className="text-green-400 animate-pulse" /> : i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-xs font-medium truncate", i === 0 && "text-green-400")}>{track.name}</p>
                <p className="text-xs text-[var(--lyra-text-muted)] truncate">{track.artist}</p>
              </div>
              <span className="text-xs text-[var(--lyra-text-muted)]">{formatTime(track.duration)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Expanded full player */}
      {expanded && (
        <div
          className="border-t border-[var(--lyra-border-glass)] p-4 animate-slide-in-up glass"
        >
          {/* Large album art */}
          <div
            className="w-32 h-32 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #1db954 0%, #0f9d3c 100%)" }}
          >
            <Music size={48} className="text-white opacity-80" />
          </div>

          {/* Track info */}
          <div className="text-center mb-4">
            <h3 className="font-bold text-[var(--lyra-text-primary)]">{current.name}</h3>
            <p className="text-sm text-[var(--lyra-text-muted)]">{current.artist}</p>
            <p className="text-xs text-[var(--lyra-text-muted)]/60">{current.album}</p>
          </div>

          {/* Progress */}
          <div className="space-y-1 mb-4">
            <div className="h-1.5 rounded-full bg-[var(--lyra-tertiary-bg)] cursor-pointer group">
              <div
                className="h-full rounded-full bg-green-400 group-hover:bg-green-300 transition-colors relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-[var(--lyra-text-muted)]">
              <span>{formatTime(current.progress)}</span>
              <span>{formatTime(current.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={cn(
                "transition-colors",
                shuffle ? "text-green-400" : "text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)]"
              )}
            >
              <Shuffle size={16} />
            </button>
            <button className="text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors">
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
            </button>
            <button className="text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors">
              <SkipForward size={20} />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={cn(
                "transition-colors",
                repeat ? "text-green-400" : "text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)]"
              )}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-[var(--lyra-text-muted)] flex-shrink-0" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-1 accent-green-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
