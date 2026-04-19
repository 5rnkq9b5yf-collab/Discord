"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { THEMES, applyTheme } from "@/lib/themes";
import type { Theme } from "@/lib/types";
import { Check } from "lucide-react";

interface ThemeCardProps {
  theme: Theme;
  selected: boolean;
  previewing: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, selected, previewing, onClick }: ThemeCardProps) {
  const { preview } = theme;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden border-2 transition-all duration-200 group",
        selected
          ? "border-[var(--lyra-accent)] shadow-[0_0_20px_var(--lyra-accent)]"
          : previewing
          ? "border-[var(--lyra-accent)]/50"
          : "border-[var(--lyra-border)] hover:border-[var(--lyra-accent)]/60"
      )}
    >
      {/* Mini app preview */}
      <div
        className="w-full h-20 flex"
        style={{ background: preview.primaryBg }}
      >
        {/* Sidebar */}
        <div className="w-6 h-full flex flex-col items-center py-1 gap-1"
          style={{ background: preview.sidebarBg }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full"
              style={{ background: i === 0 ? preview.accent : preview.primaryBg }} />
          ))}
        </div>
        {/* Channel sidebar */}
        <div className="w-10 h-full py-2 px-1"
          style={{ background: preview.secondaryBg }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1.5 rounded mb-1"
              style={{
                background: i === 0 ? preview.accent : preview.textPrimary + "30",
                width: ["70%", "90%", "60%", "80%"][i],
              }} />
          ))}
        </div>
        {/* Chat area */}
        <div className="flex-1 h-full p-1.5 flex flex-col justify-end gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: preview.accent + "88" }} />
              <div className="h-1.5 rounded flex-1"
                style={{ background: preview.textPrimary + "40", width: ["80%", "50%", "70%"][i] }} />
            </div>
          ))}
        </div>
      </div>

      {/* Theme name */}
      <div
        className="px-2 py-1.5 text-left"
        style={{ background: preview.secondaryBg }}
      >
        <p className="text-xs font-semibold truncate" style={{ color: preview.textPrimary }}>
          {theme.name}
        </p>
        <p className="text-[10px] truncate opacity-60" style={{ color: preview.textPrimary }}>
          {theme.description}
        </p>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: preview.accent }}
        >
          <Check size={12} className="text-white" />
        </div>
      )}
    </button>
  );
}

interface ThemePickerProps {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
  className?: string;
}

export function ThemePicker({ currentThemeId, onSelectTheme, className }: ThemePickerProps) {
  const [previewing, setPreviewing] = useState<string | null>(null);

  const handleHover = (themeId: string) => {
    setPreviewing(themeId);
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) applyTheme(theme.tokens);
  };

  const handleLeave = () => {
    setPreviewing(null);
    const current = THEMES.find((t) => t.id === currentThemeId);
    if (current) applyTheme(current.tokens);
  };

  const handleSelect = (themeId: string) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) applyTheme(theme.tokens);
    onSelectTheme(themeId);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-semibold text-[var(--lyra-text-primary)] mb-1">Choose Your Vibe</h3>
        <p className="text-sm text-[var(--lyra-text-muted)]">
          Hover to preview, click to apply. All themes are free.
        </p>
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
      >
        {THEMES.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={theme.id === currentThemeId}
            previewing={theme.id === previewing}
            onClick={() => handleSelect(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}
