"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { MOCK_USERS } from "@/lib/mock-data";
import { ArrowRight, Sparkles, Music, Palette, Zap, Shield, Star } from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles size={20} />,
    title: "Animated Avatars & Effects",
    description: "GIF avatars, particle effects, neon glows, rainbow borders — all free. No Nitro required.",
    color: "#c084fc",
  },
  {
    icon: <Palette size={20} />,
    title: "Full Theme Customization",
    description: "12+ beautiful themes, custom CSS editor, color token system. Make it yours.",
    color: "#38bdf8",
  },
  {
    icon: <Music size={20} />,
    title: "Spotify Integration",
    description: "Show what you're listening to on your profile. Shared listening parties in voice channels.",
    color: "#4ade80",
  },
  {
    icon: <Zap size={20} />,
    title: "Rich Profile System",
    description: "Animated banners, custom fonts, identity tags, badges, per-server profiles.",
    color: "#fbbf24",
  },
  {
    icon: <Shield size={20} />,
    title: "Privacy Controls",
    description: "Fine-grained control over who sees each part of your profile. You own your data.",
    color: "#fb7185",
  },
  {
    icon: <Star size={20} />,
    title: "Always Free",
    description: "Everything Discord charges for via Nitro is free on Lyra. Every feature, for everyone.",
    color: "#a855f7",
  },
];

const SHOWCASE_USERS = MOCK_USERS.slice(0, 3);

export default function LandingPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inputBorder, setInputBorder] = useState("var(--lyra-input-border)");

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setInviteError("Please enter an invite code.");
      return;
    }
    setInviteLoading(true);
    setInviteError("");
    await new Promise((r) => setTimeout(r, 800));
    if (inviteCode.length > 4) {
      router.push("/onboarding");
    } else {
      setInviteError("Invalid invite code. Try asking someone who's already on Lyra!");
      setInviteLoading(false);
    }
  };

  return (
    <div className="min-h-full overflow-y-auto" style={{ background: "var(--lyra-primary-bg)", backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(100,140,255,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(140,180,255,0.07) 0%, transparent 40%)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold lyra-gradient-text">♪ Lyra</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/chat")}>
          Sign In
        </Button>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-20 max-w-4xl mx-auto">
        <div className="relative mb-8 h-8">
          <span className="absolute left-1/4 text-2xl animate-float" style={{ animationDelay: "0s" }}>✦</span>
          <span className="absolute right-1/3 text-lg animate-float opacity-60" style={{ animationDelay: "0.5s" }}>✦</span>
          <span className="absolute right-1/4 text-xl animate-float opacity-40" style={{ animationDelay: "1s" }}>✦</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="lyra-gradient-text">Express Yourself</span>
          <br />
          <span style={{ color: "var(--lyra-text-primary)" }}>Without Limits</span>
        </h1>

        <p className="text-xl text-[var(--lyra-text-secondary)] mb-4 max-w-2xl mx-auto leading-relaxed">
          Lyra is an invite-only chat platform where every feature is free. Animated avatars, Spotify
          integration, custom themes, rich profiles — no paywalls.
        </p>
        <p className="text-sm text-[var(--lyra-text-muted)] mb-10">
          Named after the constellation ♪ — a star and a musical instrument.
        </p>

        <form onSubmit={handleInviteSubmit} className="flex flex-col items-center gap-4 mb-8">
          <div className="flex gap-3 w-full max-w-md">
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => { setInviteCode(e.target.value); setInviteError(""); }}
              placeholder="Enter your invite code"
              className="flex-1 px-4 py-3 rounded-xl text-sm border outline-none transition-all"
              style={{
                background: "var(--lyra-input-bg)",
                borderColor: inviteError ? "var(--lyra-status-dnd)" : inputBorder,
                color: "var(--lyra-text-primary)",
              }}
              onFocus={() => setInputBorder("var(--lyra-accent)")}
              onBlur={() => setInputBorder(inviteError ? "var(--lyra-status-dnd)" : "var(--lyra-input-border)")}
            />
            <Button type="submit" size="lg" loading={inviteLoading} icon={<ArrowRight size={18} />} className="px-6">
              Join Lyra
            </Button>
          </div>
          {inviteError && <p className="text-sm text-[var(--lyra-status-dnd)]">{inviteError}</p>}
          <p className="text-xs text-[var(--lyra-text-muted)]">
            Don&apos;t have an invite? Ask a friend who&apos;s already on Lyra. Enter any code longer than 4 chars to demo.
          </p>
        </form>

        <Button variant="ghost" size="md" onClick={() => router.push("/chat")} className="text-[var(--lyra-text-muted)]">
          Already have an account? Sign in →
        </Button>
      </section>

      {/* Profile showcase */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[var(--lyra-text-primary)] mb-3">
          Your profile, your way
        </h2>
        <p className="text-center text-[var(--lyra-text-muted)] mb-10">Every customization feature is free. Forever.</p>

        <div className="flex flex-wrap justify-center gap-4">
          {SHOWCASE_USERS.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl overflow-hidden w-56 cursor-pointer hover-lift glass-surface"
            >
              <div
                className="h-16 w-full"
                style={{
                  background: `linear-gradient(135deg, ${user.displayColor || "var(--lyra-accent)"}88, var(--lyra-button-primary))`,
                }}
              />
              <div className="px-3 -mt-6 pb-3">
                <div className="p-1 rounded-full inline-block" style={{ background: "var(--lyra-secondary-bg)" }}>
                  <div className="relative">
                    <Avatar
                      displayName={user.displayName}
                      src={user.avatar}
                      shape={user.avatarShape}
                      effect={user.avatarEffect}
                      size={48}
                    />
                    <StatusIndicator
                      status={user.status}
                      size="sm"
                      className="absolute -bottom-0.5 -right-0.5 border-2 border-[var(--lyra-secondary-bg)]"
                    />
                  </div>
                </div>
                <p className="text-sm font-bold mt-1 truncate" style={{ color: user.displayColor || "var(--lyra-text-primary)" }}>
                  {user.displayName}
                </p>
                <p className="text-xs text-[var(--lyra-text-muted)]">@{user.username}</p>
                {user.pronouns && <p className="text-xs text-[var(--lyra-text-muted)]">{user.pronouns}</p>}
                {user.bio && <p className="text-xs text-[var(--lyra-text-secondary)] mt-1 line-clamp-2">{user.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[var(--lyra-text-primary)] mb-3">
          Everything Discord charges for — free.
        </h2>
        <p className="text-center text-[var(--lyra-text-muted)] mb-10">We believe expression should not cost money.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl transition-all duration-200 hover-lift glass-surface"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: feature.color + "22", color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-[var(--lyra-text-primary)] mb-1">{feature.title}</h3>
              <p className="text-sm text-[var(--lyra-text-secondary)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div
          className="max-w-xl mx-auto p-10 rounded-3xl glass-modal"
        >
          <span className="text-5xl mb-4 block">♪</span>
          <h2 className="text-3xl font-bold text-[var(--lyra-text-primary)] mb-2">Ready to join Lyra?</h2>
          <p className="text-[var(--lyra-text-muted)] mb-6">Get an invite from a friend or try the demo.</p>
          <Button size="lg" icon={<ArrowRight size={18} />} onClick={() => router.push("/onboarding")}>
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-[var(--lyra-text-muted)] border-t border-[var(--lyra-border)]">
        <p>♪ Lyra — built with love for everyone who deserves to express themselves</p>
        <p className="mt-1 opacity-50">Not affiliated with Discord, Inc.</p>
      </footer>
    </div>
  );
}
