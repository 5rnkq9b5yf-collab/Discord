"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { IdentityTag } from "@/components/ui/IdentityTag";
import { ThemePicker } from "@/components/theme/ThemePicker";
import { useTheme } from "@/components/theme/ThemeProvider";
import { AVATAR_EFFECTS } from "@/components/ui/Avatar";
import { generateId } from "@/lib/utils";
import type { AvatarShape, IdentityTag as IdentityTagType } from "@/lib/types";
import { ArrowRight, ArrowLeft, Check, Music, User, Smile, Palette, Tag, FileText } from "lucide-react";
import canvasConfetti from "canvas-confetti";

const AVATAR_SHAPES: { id: AvatarShape; label: string }[] = [
  { id: "circle", label: "Circle" },
  { id: "squircle", label: "Squircle" },
  { id: "square", label: "Square" },
];

const TAG_COLORS = [
  "#c084fc", "#fb7185", "#38bdf8", "#4ade80",
  "#fbbf24", "#a855f7", "#f97316", "#34d399",
];

const TOTAL_STEPS = 8;

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i < current
              ? "w-6 h-2 bg-[var(--lyra-accent)]"
              : i === current
              ? "w-4 h-2 bg-[var(--lyra-accent)] opacity-80"
              : "w-2 h-2 bg-[var(--lyra-border)]"
          )}
        />
      ))}
    </div>
  );
}

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="text-7xl animate-float">♪</div>
      <h1 className="text-4xl font-extrabold lyra-gradient-text">Welcome to Lyra</h1>
      <p className="text-[var(--lyra-text-secondary)] max-w-sm leading-relaxed">
        A place to express yourself fully. Animated avatars, rich profiles, Spotify
        integration, and stunning themes — all completely free.
      </p>
      <p className="text-sm text-[var(--lyra-text-muted)]">
        Let&apos;s set up your profile in a few easy steps.
      </p>
      <Button size="lg" icon={<ArrowRight size={18} />} onClick={onNext}>
        Let&apos;s get started
      </Button>
    </div>
  );
}

function StepNameUsername({
  displayName,
  username,
  onDisplayName,
  onUsername,
  onNext,
  onBack,
}: {
  displayName: string;
  username: string;
  onDisplayName: (v: string) => void;
  onUsername: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const handleUsername = (v: string) => {
    const clean = v.toLowerCase().replace(/[^a-z0-9_]/g, "");
    onUsername(clean);
    if (clean.length >= 3) {
      setUsernameStatus("checking");
      setTimeout(() => {
        setUsernameStatus(clean === "admin" || clean === "lyra" ? "taken" : "available");
      }, 600);
    } else {
      setUsernameStatus("idle");
    }
  };

  const canContinue = displayName.trim().length >= 1 && username.length >= 3 && usernameStatus === "available";

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "var(--lyra-accent)22" }}>
          <User size={24} style={{ color: "var(--lyra-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--lyra-text-primary)]">What should we call you?</h2>
        <p className="text-[var(--lyra-text-muted)] text-sm mt-1">You can change these anytime</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onDisplayName(e.target.value)}
            placeholder="Lily ✨"
            maxLength={50}
            className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-colors"
            style={{
              background: "var(--lyra-input-bg)",
              borderColor: "var(--lyra-input-border)",
              color: "var(--lyra-text-primary)",
            }}
          />
          <p className="text-xs text-[var(--lyra-text-muted)] mt-1">This is shown to others. Can include any characters.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--lyra-text-muted)] text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsername(e.target.value)}
              placeholder="starlily"
              maxLength={32}
              className="w-full pl-8 pr-12 py-3 rounded-xl border outline-none text-sm transition-colors"
              style={{
                background: "var(--lyra-input-bg)",
                borderColor: usernameStatus === "taken"
                  ? "var(--lyra-status-dnd)"
                  : usernameStatus === "available"
                  ? "var(--lyra-status-online)"
                  : "var(--lyra-input-border)",
                color: "var(--lyra-text-primary)",
              }}
            />
            {usernameStatus === "checking" && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--lyra-text-muted)]">...</span>
            )}
            {usernameStatus === "available" && (
              <Check size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--lyra-status-online)]" />
            )}
          </div>
          {usernameStatus === "taken" && (
            <p className="text-xs text-[var(--lyra-status-dnd)] mt-1">That username is taken. Try another.</p>
          )}
          {usernameStatus === "available" && (
            <p className="text-xs text-[var(--lyra-status-online)] mt-1">@{username} is available!</p>
          )}
          <p className="text-xs text-[var(--lyra-text-muted)] mt-1">Lowercase letters, numbers, underscores only. Used for @mentions.</p>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <Button variant="ghost" size="md" icon={<ArrowLeft size={16} />} onClick={onBack}>Back</Button>
        <Button size="md" icon={<ArrowRight size={16} />} onClick={onNext} disabled={!canContinue} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

function StepAvatar({
  displayName,
  avatarShape,
  avatarEffect,
  onShape,
  onEffect,
  onNext,
  onBack,
}: {
  displayName: string;
  avatarShape: AvatarShape;
  avatarEffect: string;
  onShape: (s: AvatarShape) => void;
  onEffect: (e: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "var(--lyra-accent)22" }}>
          <Smile size={24} style={{ color: "var(--lyra-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--lyra-text-primary)]">Set your avatar</h2>
        <p className="text-[var(--lyra-text-muted)] text-sm mt-1">Choose a shape and effect</p>
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <Avatar
          displayName={displayName}
          shape={avatarShape}
          effect={avatarEffect !== "none" ? avatarEffect : undefined}
          size={96}
        />
      </div>

      {/* Shape picker */}
      <div>
        <p className="text-sm font-medium text-[var(--lyra-text-secondary)] mb-2">Avatar Shape</p>
        <div className="flex gap-3">
          {AVATAR_SHAPES.map((s) => (
            <button
              key={s.id}
              onClick={() => onShape(s.id)}
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
      </div>

      {/* Effect picker */}
      <div>
        <p className="text-sm font-medium text-[var(--lyra-text-secondary)] mb-2">Avatar Effect</p>
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_EFFECTS.map((eff) => (
            <button
              key={eff.id}
              onClick={() => onEffect(eff.id)}
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
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" size="md" icon={<ArrowLeft size={16} />} onClick={onBack}>Back</Button>
        <Button size="md" icon={<ArrowRight size={16} />} onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}

function StepTheme({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { themeId, setThemeId } = useTheme();
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "var(--lyra-accent)22" }}>
          <Palette size={24} style={{ color: "var(--lyra-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--lyra-text-primary)]">Choose your vibe</h2>
        <p className="text-[var(--lyra-text-muted)] text-sm mt-1">Hover to preview. You can change this anytime.</p>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
        <ThemePicker currentThemeId={themeId} onSelectTheme={setThemeId} />
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" size="md" icon={<ArrowLeft size={16} />} onClick={onBack}>Back</Button>
        <Button size="md" icon={<ArrowRight size={16} />} onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}

function StepIdentity({
  pronouns,
  tags,
  onPronouns,
  onTags,
  onNext,
  onBack,
}: {
  pronouns: string;
  tags: IdentityTagType[];
  onPronouns: (v: string) => void;
  onTags: (t: IdentityTagType[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const label = tagInput.trim();
    if (!label || tags.length >= 5) return;
    const color = TAG_COLORS[tags.length % TAG_COLORS.length];
    onTags([...tags, { id: generateId(), label, color }]);
    setTagInput("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "var(--lyra-accent)22" }}>
          <Tag size={24} style={{ color: "var(--lyra-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--lyra-text-primary)]">Identity & Pronouns</h2>
        <p className="text-[var(--lyra-text-muted)] text-sm mt-1">All optional — skip if you prefer</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--lyra-text-secondary)] mb-1.5">Pronouns</label>
        <input
          type="text"
          value={pronouns}
          onChange={(e) => onPronouns(e.target.value)}
          placeholder="she/her, they/them, he/him, etc."
          className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-colors"
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
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="artist, gamer, she/her..."
            disabled={tags.length >= 5}
            className="flex-1 px-4 py-2.5 rounded-xl border outline-none text-sm transition-colors"
            style={{ background: "var(--lyra-input-bg)", borderColor: "var(--lyra-input-border)", color: "var(--lyra-text-primary)" }}
          />
          <Button variant="secondary" size="sm" onClick={addTag} disabled={!tagInput.trim() || tags.length >= 5}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <IdentityTag
                key={tag.id}
                tag={tag}
                onRemove={() => onTags(tags.filter((t) => t.id !== tag.id))}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" size="md" icon={<ArrowLeft size={16} />} onClick={onBack}>Back</Button>
        <Button size="md" icon={<ArrowRight size={16} />} onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}

function StepBio({
  bio,
  onBio,
  onNext,
  onBack,
}: {
  bio: string;
  onBio: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "var(--lyra-accent)22" }}>
          <FileText size={24} style={{ color: "var(--lyra-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--lyra-text-primary)]">Write your bio</h2>
        <p className="text-[var(--lyra-text-muted)] text-sm mt-1">Tell people a bit about yourself. Optional!</p>
      </div>

      <div>
        <textarea
          value={bio}
          onChange={(e) => onBio(e.target.value.slice(0, 300))}
          placeholder="artist & dreamer. i make things pretty. ☁️"
          rows={5}
          className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none transition-colors"
          style={{ background: "var(--lyra-input-bg)", borderColor: "var(--lyra-input-border)", color: "var(--lyra-text-primary)" }}
        />
        <p className="text-xs text-[var(--lyra-text-muted)] mt-1 text-right">{bio.length}/300</p>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" size="md" icon={<ArrowLeft size={16} />} onClick={onBack}>Back</Button>
        <Button size="md" icon={<ArrowRight size={16} />} onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}

function StepSpotify({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [connected, setConnected] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "#1db95422" }}>
          <Music size={24} style={{ color: "#1db954" }} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--lyra-text-primary)]">Connect Spotify</h2>
        <p className="text-[var(--lyra-text-muted)] text-sm mt-1">Show what you&apos;re listening to on your profile</p>
      </div>

      {connected ? (
        <div
          className="flex items-center gap-3 p-4 rounded-2xl border"
          style={{ background: "#1db95415", borderColor: "#1db95440" }}
        >
          <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center">
            <Music size={18} className="text-black" />
          </div>
          <div>
            <p className="font-semibold text-[var(--lyra-text-primary)] text-sm">Spotify Connected</p>
            <p className="text-xs text-[var(--lyra-text-muted)]">Your now playing will appear on your profile</p>
          </div>
          <Check size={18} className="ml-auto text-[#1db954]" />
        </div>
      ) : (
        <div
          className="p-6 rounded-2xl border text-center"
          style={{ background: "var(--lyra-secondary-bg)", borderColor: "var(--lyra-border)" }}
        >
          <p className="text-[var(--lyra-text-secondary)] text-sm mb-4">
            Connect your Spotify account to automatically show your now playing on your profile card and full profile.
            It&apos;s optional and can be disconnected anytime.
          </p>
          <Button
            variant="secondary"
            size="md"
            icon={<Music size={16} />}
            onClick={() => setConnected(true)}
            className="mx-auto"
            style={{ background: "#1db954", color: "#000", borderColor: "#1db954" } as React.CSSProperties}
          >
            Connect Spotify
          </Button>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" size="md" icon={<ArrowLeft size={16} />} onClick={onBack}>Back</Button>
        <Button variant="ghost" size="md" onClick={onNext} className="flex-1 text-[var(--lyra-text-muted)]">
          {connected ? <><ArrowRight size={16} /> Continue</> : "Skip for now →"}
        </Button>
        {connected && (
          <Button size="md" icon={<ArrowRight size={16} />} onClick={onNext} className="flex-1">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}

function StepDone({ displayName, onEnter }: { displayName: string; onEnter: () => void }) {
  useEffect(() => {
    const fire = () => {
      canvasConfetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#c084fc", "#f472b6", "#38bdf8", "#4ade80", "#fbbf24"],
      });
    };
    fire();
    const t = setTimeout(fire, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="text-7xl animate-float">🌟</div>
      <h1 className="text-4xl font-extrabold lyra-gradient-text">
        You&apos;re all set, {displayName || "friend"}!
      </h1>
      <p className="text-[var(--lyra-text-secondary)] max-w-sm leading-relaxed">
        Your profile is ready. Explore Lyra, join servers, and make it truly yours.
        Remember — every feature here is free, always.
      </p>
      <Button size="lg" icon={<ArrowRight size={18} />} onClick={onEnter} className="mt-2">
        Enter Lyra ♪
      </Button>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarShape, setAvatarShape] = useState<AvatarShape>("circle");
  const [avatarEffect, setAvatarEffect] = useState("none");
  const [pronouns, setPronouns] = useState("");
  const [tags, setTags] = useState<IdentityTagType[]>([]);
  const [bio, setBio] = useState("");

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const steps = [
    <StepWelcome key="welcome" onNext={next} />,
    <StepNameUsername
      key="name"
      displayName={displayName}
      username={username}
      onDisplayName={setDisplayName}
      onUsername={setUsername}
      onNext={next}
      onBack={back}
    />,
    <StepAvatar
      key="avatar"
      displayName={displayName}
      avatarShape={avatarShape}
      avatarEffect={avatarEffect}
      onShape={setAvatarShape}
      onEffect={setAvatarEffect}
      onNext={next}
      onBack={back}
    />,
    <StepTheme key="theme" onNext={next} onBack={back} />,
    <StepIdentity
      key="identity"
      pronouns={pronouns}
      tags={tags}
      onPronouns={setPronouns}
      onTags={setTags}
      onNext={next}
      onBack={back}
    />,
    <StepBio key="bio" bio={bio} onBio={setBio} onNext={next} onBack={back} />,
    <StepSpotify key="spotify" onNext={next} onBack={back} />,
    <StepDone key="done" displayName={displayName} onEnter={() => router.push("/app")} />,
  ];

  return (
    <div
      className="min-h-full flex items-center justify-center p-4"
      style={{ background: "var(--lyra-primary-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-[var(--lyra-border)] p-8 shadow-2xl"
        style={{ background: "var(--lyra-secondary-bg)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-bold lyra-gradient-text">♪ Lyra</span>
          <span className="text-xs text-[var(--lyra-text-muted)]">Step {step + 1} of {TOTAL_STEPS}</span>
        </div>
        <StepIndicator current={step} total={TOTAL_STEPS} />
        <div className="animate-fade-in">{steps[step]}</div>
      </div>
    </div>
  );
}
