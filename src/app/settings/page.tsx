"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { ThemePicker } from "@/components/theme/ThemePicker";
import { CustomCSSEditor } from "@/components/theme/CustomCSSEditor";
import { SpotifyWidget } from "@/components/spotify/SpotifyWidget";
import { IdentityTag } from "@/components/ui/IdentityTag";
import { useTheme } from "@/components/theme/ThemeProvider";
import { CURRENT_USER } from "@/lib/mock-data";
import { AVATAR_EFFECTS } from "@/components/ui/Avatar";
import type { AvatarShape, UserStatus, IdentityTag as IdentityTagType } from "@/lib/types";
import { generateId } from "@/lib/utils";
import {
  Palette,
  User,
  Link,
  Bell,
  Shield,
  Volume2,
  Accessibility,
  X,
  ArrowLeft,
  Music,
  Check,
} from "lucide-react";

type SettingsTab =
  | "appearance"
  | "profile"
  | "connections"
  | "notifications"
  | "privacy"
  | "voice"
  | "accessibility";

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "connections", label: "Connections", icon: <Link size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "privacy", label: "Privacy & Safety", icon: <Shield size={16} /> },
  { id: "voice", label: "Voice & Video", icon: <Volume2 size={16} /> },
  { id: "accessibility", label: "Accessibility", icon: <Accessibility size={16} /> },
];

const AVATAR_SHAPES: { id: AvatarShape; label: string }[] = [
  { id: "circle", label: "Circle" },
  { id: "squircle", label: "Squircle" },
  { id: "square", label: "Square" },
];

function AppearanceTab() {
  const { themeId, setThemeId, customCSS, setCustomCSS } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [density, setDensity] = useState<"compact" | "comfortable" | "cozy">("comfortable");
  const [fontSize, setFontSize] = useState(14);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[var(--lyra-text-primary)] mb-1">Appearance</h2>
        <p className="text-sm text-[var(--lyra-text-muted)]">Customize how Lyra looks and feels.</p>
      </div>

      <section className="space-y-4">
        <ThemePicker currentThemeId={themeId} onSelectTheme={setThemeId} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--lyra-text-primary)]">Message Density</h3>
        <div className="flex gap-2">
          {(["compact", "comfortable", "cozy"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl border text-sm transition-all capitalize",
                density === d
                  ? "border-[var(--lyra-accent)] bg-[var(--lyra-accent)]/10 text-[var(--lyra-accent)] font-medium"
                  : "border-[var(--lyra-border)] text-[var(--lyra-text-muted)] hover:border-[var(--lyra-accent)]/50"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--lyra-text-primary)]">Font Size</h3>
          <span className="text-sm text-[var(--lyra-text-muted)]">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={20}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-[var(--lyra-accent)]"
        />
        <div className="flex justify-between text-xs text-[var(--lyra-text-muted)]">
          <span>Small (12px)</span>
          <span>Large (20px)</span>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--lyra-text-primary)]">Advanced — Custom CSS</h3>
            <p className="text-xs text-[var(--lyra-text-muted)] mt-0.5">Direct CSS injection for full control</p>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-[var(--lyra-accent)] hover:underline"
          >
            {showAdvanced ? "Hide" : "Show"}
          </button>
        </div>
        {showAdvanced && (
          <CustomCSSEditor value={customCSS} onChange={setCustomCSS} />
        )}
      </section>
    </div>
  );
}

function ProfileTab() {
  const [displayName, setDisplayName] = useState(CURRENT_USER.displayName);
  const [bio, setBio] = useState(CURRENT_USER.bio || "");
  const [pronouns, setPronouns] = useState(CURRENT_USER.pronouns || "");
  const [avatarShape, setAvatarShape] = useState<AvatarShape>(CURRENT_USER.avatarShape);
  const [avatarEffect, setAvatarEffect] = useState(CURRENT_USER.avatarEffect || "none");
  const [tags, setTags] = useState<IdentityTagType[]>(CURRENT_USER.identityTags);
  const [tagInput, setTagInput] = useState("");
  const [displayColor, setDisplayColor] = useState(CURRENT_USER.displayColor || "#c084fc");
  const [saved, setSaved] = useState(false);

  const addTag = () => {
    const label = tagInput.trim();
    if (!label || tags.length >= 5) return;
    const colors = ["#c084fc", "#fb7185", "#38bdf8", "#4ade80", "#fbbf24"];
    setTags([...tags, { id: generateId(), label, color: colors[tags.length % colors.length] }]);
    setTagInput("");
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[var(--lyra-text-primary)] mb-1">Profile</h2>
        <p className="text-sm text-[var(--lyra-text-muted)]">Manage your profile information and customization.</p>
      </div>

      {/* Preview */}
      <div
        className="rounded-2xl overflow-hidden border border-[var(--lyra-border)]"
        style={{ background: "var(--lyra-secondary-bg)" }}
      >
        <div className="h-20 w-full" style={{ background: "linear-gradient(135deg, var(--lyra-button-primary), var(--lyra-accent))" }} />
        <div className="px-4 pb-4">
          <div className="p-1 rounded-full inline-block -mt-7" style={{ background: "var(--lyra-secondary-bg)" }}>
            <Avatar displayName={displayName} shape={avatarShape} effect={avatarEffect !== "none" ? avatarEffect : undefined} size={60} />
          </div>
          <p className="font-bold text-sm mt-1" style={{ color: displayColor }}>{displayName}</p>
          <p className="text-xs text-[var(--lyra-text-muted)]">@{CURRENT_USER.username}</p>
          {pronouns && <p className="text-xs text-[var(--lyra-text-muted)]">{pronouns}</p>}
          {bio && <p className="text-xs text-[var(--lyra-text-secondary)] mt-1 line-clamp-2">{bio}</p>}
        </div>
      </div>

      {/* Avatar section */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--lyra-text-primary)]">Avatar Shape</h3>
        <div className="flex gap-2">
          {AVATAR_SHAPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setAvatarShape(s.id)}
              className={cn(
                "flex-1 py-2 rounded-xl border text-sm transition-all",
                avatarShape === s.id
                  ? "border-[var(--lyra-accent)] bg-[var(--lyra-accent)]/10 text-[var(--lyra-accent)] font-medium"
                  : "border-[var(--lyra-border)] text-[var(--lyra-text-muted)] hover:border-[var(--lyra-accent)]/50"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-[var(--lyra-text-primary)]">Avatar Effect</h3>
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_EFFECTS.map((eff) => (
            <button
              key={eff.id}
              onClick={() => setAvatarEffect(eff.id)}
              className={cn(
                "px-3 py-2 rounded-xl border text-xs transition-all",
                avatarEffect === eff.id
                  ? "border-[var(--lyra-accent)] bg-[var(--lyra-accent)]/10 text-[var(--lyra-accent)] font-medium"
                  : "border-[var(--lyra-border)] text-[var(--lyra-text-muted)] hover:border-[var(--lyra-accent)]/50"
              )}
            >
              {eff.label}
            </button>
          ))}
        </div>
      </section>

      {/* Display info */}
      <section className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-colors"
            style={{ background: "var(--lyra-input-bg)", borderColor: "var(--lyra-input-border)", color: "var(--lyra-text-primary)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">Display Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={displayColor}
              onChange={(e) => setDisplayColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              value={displayColor}
              onChange={(e) => setDisplayColor(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm font-mono"
              style={{ background: "var(--lyra-input-bg)", borderColor: "var(--lyra-input-border)", color: "var(--lyra-text-primary)" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">Pronouns</label>
          <input
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="she/her, they/them..."
            className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-colors"
            style={{ background: "var(--lyra-input-bg)", borderColor: "var(--lyra-input-border)", color: "var(--lyra-text-primary)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">
            Identity Tags <span className="text-[var(--lyra-text-muted)] font-normal">({tags.length}/5)</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); }}}
              disabled={tags.length >= 5}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 rounded-xl border outline-none text-sm"
              style={{ background: "var(--lyra-input-bg)", borderColor: "var(--lyra-input-border)", color: "var(--lyra-text-primary)" }}
            />
            <Button variant="secondary" size="sm" onClick={addTag} disabled={!tagInput.trim() || tags.length >= 5}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <IdentityTag key={tag.id} tag={tag} onRemove={() => setTags(tags.filter((t) => t.id !== tag.id))} />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">
            Bio <span className="text-[var(--lyra-text-muted)] font-normal">({bio.length}/300)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            rows={4}
            placeholder="Tell people about yourself..."
            className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm resize-none transition-colors"
            style={{ background: "var(--lyra-input-bg)", borderColor: "var(--lyra-input-border)", color: "var(--lyra-text-primary)" }}
          />
        </div>
      </section>

      <Button
        size="md"
        icon={saved ? <Check size={16} /> : undefined}
        onClick={handleSave}
        style={saved ? { background: "var(--lyra-status-online)" } as React.CSSProperties : undefined}
      >
        {saved ? "Saved!" : "Save Changes"}
      </Button>
    </div>
  );
}

function ConnectionsTab() {
  const [spotifyConnected, setSpotifyConnected] = useState(CURRENT_USER.spotifyConnected);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[var(--lyra-text-primary)] mb-1">Connections</h2>
        <p className="text-sm text-[var(--lyra-text-muted)]">Connect external accounts to display on your profile.</p>
      </div>

      {/* Spotify */}
      <section
        className="p-4 rounded-2xl border border-[var(--lyra-border)]"
        style={{ background: "var(--lyra-secondary-bg)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1db954] flex items-center justify-center">
              <Music size={18} className="text-black" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--lyra-text-primary)]">Spotify</p>
              {spotifyConnected && (
                <p className="text-xs text-[var(--lyra-text-muted)]">Connected as @{CURRENT_USER.username}</p>
              )}
            </div>
          </div>
          <Button
            variant={spotifyConnected ? "danger" : "secondary"}
            size="sm"
            onClick={() => setSpotifyConnected(!spotifyConnected)}
          >
            {spotifyConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
        {spotifyConnected && CURRENT_USER.nowPlaying && (
          <SpotifyWidget track={CURRENT_USER.nowPlaying} compact />
        )}
      </section>

      {/* Other social accounts */}
      {[
        { name: "GitHub", icon: "⚙️", color: "#24292e" },
        { name: "Twitter / X", icon: "𝕏", color: "#000" },
        { name: "YouTube", icon: "▶️", color: "#ff0000" },
        { name: "Instagram", icon: "📷", color: "#e1306c" },
      ].map((account) => (
        <section
          key={account.name}
          className="flex items-center justify-between p-4 rounded-2xl glass-surface"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
              style={{ background: account.color }}
            >
              {account.icon}
            </div>
            <p className="font-semibold text-sm text-[var(--lyra-text-primary)]">{account.name}</p>
          </div>
          <Button variant="secondary" size="sm">Connect</Button>
        </section>
      ))}
    </div>
  );
}

function SimpleSection({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--lyra-text-primary)] mb-1">{title}</h2>
        <p className="text-sm text-[var(--lyra-text-muted)]">{description}</p>
      </div>
      {children}
      <div className="p-6 rounded-2xl glass-surface flex flex-col items-center text-center gap-3">
        <span className="text-3xl">🚧</span>
        <p className="text-[var(--lyra-text-secondary)] text-sm">Full settings coming soon. The backend integration will unlock all options.</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");

  const CONTENT: Record<SettingsTab, React.ReactNode> = {
    appearance: <AppearanceTab />,
    profile: <ProfileTab />,
    connections: <ConnectionsTab />,
    notifications: <SimpleSection title="Notifications" description="Manage how and when you get notified." />,
    privacy: <SimpleSection title="Privacy & Safety" description="Control who can see your profile and contact you." />,
    voice: <SimpleSection title="Voice & Video" description="Configure your microphone, speakers, and camera." />,
    accessibility: <SimpleSection title="Accessibility" description="Reduce motion, high contrast, and more." />,
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "var(--lyra-primary-bg)" }}>
      {/* Settings sidebar */}
      <aside className="glass-sidebar w-64 flex-shrink-0 flex flex-col py-6 px-3">
        <div className="flex items-center gap-2 mb-4 px-2">
          <button
            onClick={() => router.push("/chat")}
            className="transition-colors"
            style={{ color: "var(--lyra-text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--lyra-accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--lyra-text-muted)"; }}
            title="Back to app"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-bold" style={{ color: "var(--lyra-text-primary)" }}>Settings</h1>
        </div>

        <nav className="flex flex-col gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 text-left"
              style={{
                background: activeTab === tab.id ? "var(--lyra-glass-active)" : undefined,
                color: activeTab === tab.id ? "var(--lyra-text-primary)" : "var(--lyra-text-muted)",
                borderLeft: activeTab === tab.id ? "2px solid var(--lyra-accent)" : "2px solid transparent",
              }}
              onMouseEnter={(e) => { if (activeTab !== tab.id) { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = "var(--lyra-text-secondary)"; } }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--lyra-text-muted)"; } }}
            >
              <span style={{ color: activeTab === tab.id ? "var(--lyra-accent)" : "inherit" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4" style={{ borderTop: "0.5px solid var(--lyra-border-glass)" }}>
          <div className="flex items-center gap-2 px-2">
            <Avatar displayName={CURRENT_USER.displayName} shape={CURRENT_USER.avatarShape} size={32} />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--lyra-text-primary)" }}>{CURRENT_USER.displayName}</p>
              <p className="text-xs" style={{ color: "var(--lyra-text-muted)" }}>@{CURRENT_USER.username}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          {CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
}
