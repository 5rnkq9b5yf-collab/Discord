"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { THEMES, applyTheme } from "@/lib/themes";
import type { Theme } from "@/lib/types";
import { Check } from "lucide-react";

function ThemeCard({ theme, selected, previewing, onClick }: { theme: Theme; selected: boolean; previewing: boolean; onClick: () => void }) {
  const { preview } = theme;

  return (
    <button
      onClick={onClick}
      className={cn("relative rounded-2xl overflow-hidden transition-all duration-200 hover-lift group")}
      style={{
        border: selected
          ? `1.5px solid ${preview.accent}`
          : previewing
          ? `1px solid ${preview.accent}88`
          : "0.5px solid var(--lyra-border-glass)",
        boxShadow: selected ? `0 0 24px ${preview.accent}44` : undefined,
      }}
    >
      {/* Mini app mockup */}
      <div className="w-full h-[88px] flex" style={{ background: preview.primaryBg }}>
        {/* Server sidebar strip */}
        <div className="w-6 h-full flex flex-col items-center py-1.5 gap-1.5"
          style={{ background: preview.sidebarBg, borderRight: `0.5px solid ${preview.accent}22` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full"
              style={{ background: i === 0 ? preview.accent : preview.secondaryBg, opacity: i === 0 ? 1 : 0.5 }} />
          ))}
        </div>
        {/* Channel sidebar */}
        <div className="w-[38px] h-full py-2 px-1.5"
          style={{ background: preview.secondaryBg }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1.5 rounded-sm mb-1.5"
              style={{
                background: i === 0 ? preview.accent + "cc" : preview.textPrimary + "25",
                width: ["70%", "90%", "60%", "80%"][i],
              }} />
          ))}
        </div>
        {/* Chat */}
        <div className="flex-1 h-full p-1.5 flex flex-col justify-end gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: preview.accent + "99" }} />
              <div className="h-1.5 rounded-sm" style={{ background: preview.textPrimary + "35", width: ["75%", "50%", "65%"][i] }} />
            </div>
          ))}
          {/* Input box */}
          <div className="mt-0.5 h-3 rounded-md" style={{ background: preview.textPrimary + "12", border: `0.5px solid ${preview.accent}33` }} />
        </div>
      </div>

      {/* Name strip */}
      <div className="px-2.5 py-2 text-left" style={{ background: preview.secondaryBg }}>
        <p className="text-xs font-semibold truncate" style={{ color: preview.textPrimary }}>{theme.name}</p>
        <p className="text-[10px] truncate mt-0.5" style={{ color: preview.textPrimary, opacity: 0.5 }}>{theme.description}</p>
      </div>

      {/* Selected badge */}
      {selected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: preview.accent, boxShadow: `0 0 10px ${preview.accent}88` }}
        >
          <Check size={11} className="text-white" />
        </div>
      )}
    </button>
  );
}

interface ThemePickerProps {
  currentThemeId: string;
  onSelectTheme: (id: string) => void;
  className?: string;
}

export function ThemePicker({ currentThemeId, onSelectTheme, className }: ThemePickerProps) {
  const [previewing, setPreviewing] = useState<string | null>(null);

  const handleHover = (id: string) => {
    setPreviewing(id);
    const t = THEMES.find((t) => t.id === id);
    if (t) applyTheme(t.tokens);
  };

  const handleLeave = () => {
    setPreviewing(null);
    const t = THEMES.find((t) => t.id === currentThemeId);
    if (t) applyTheme(t.tokens);
  };

  const handleSelect = (id: string) => {
    const t = THEMES.find((t) => t.id === id);
    if (t) applyTheme(t.tokens);
    onSelectTheme(id);
  };

  const current = THEMES.find((t) => t.id === currentThemeId);

  return (
    <div className={cn("space-y-4", className)} onMouseLeave={handleLeave}>
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--lyra-text-primary)" }}>Choose Your Theme</h3>
        <p className="text-sm" style={{ color: "var(--lyra-text-muted)" }}>
          Hover to preview — each theme is full liquid glass. All free.
        </p>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
        {THEMES.map((theme) => (
          <div key={theme.id} onMouseEnter={() => handleHover(theme.id)}>
            <ThemeCard
              theme={theme}
              selected={theme.id === currentThemeId}
              previewing={theme.id === previewing}
              onClick={() => handleSelect(theme.id)}
            />
          </div>
        ))}
      </div>

      {current && (
        <p className="text-xs" style={{ color: "var(--lyra-text-muted)" }}>
          Active: <span style={{ color: "var(--lyra-accent)" }}>{current.name}</span> — {current.description}
        </p>
      )}
    </div>
  );
}
