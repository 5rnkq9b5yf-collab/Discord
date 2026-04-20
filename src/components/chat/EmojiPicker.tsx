"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const EMOJI_CATEGORIES = [
  { name: "Smileys", icon: "😊", emoji: ["😀","😂","🥲","😊","😇","🥰","😍","🤩","😘","😗","😙","😚","🙂","🤗","🤭","🫢","🤫","🤔","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","💫","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","☹️","😮","😯","😲","😳","🥺","🫣","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"] },
  { name: "Gestures", icon: "👋", emoji: ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃"] },
  { name: "Hearts", icon: "❤️", emoji: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","❤️‍🔥","❤️‍🩹","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","✡️","🔯","🕎","☯️","🛐","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎"] },
  { name: "Animals", icon: "🐱", emoji: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐝","🪱","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐟","🐠","🐬","🦭","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🦣","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🫏","🫎","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛"] },
  { name: "Food", icon: "🍕", emoji: ["🍕","🍔","🌮","🌯","🥙","🧆","🥚","🍳","🥘","🫕","🍲","🫔","🥗","🍿","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🫖","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🧊"] },
  { name: "Activities", icon: "⚽", emoji: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🏒","🏑","🥍","🏏","🪃","🥅","⛳","🪁","🛝","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖️","🏵️","🎗️","🎫","🎟️","🎪","🤹","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🪘","🥁","🪗","🎷","🎺","🎸","🪕","🎻","🎲","♟️","🎯","🎳","🎮","🎰","🧩"] },
  { name: "Symbols", icon: "✨", emoji: ["✨","⭐","🌟","💫","⚡","🔥","🌈","☁️","❄️","🌊","🌀","🌙","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌛","🌜","🌝","🌞","🪐","💥","🎆","🎇","🌺","🌸","🌼","🌻","🌹","🥀","🌷","🌱","🌿","🍃","🍂","🍁","🍄","🌾","💐","🌵","🎋","🎍","🪴","🌲","🌳","🌴","🐚","🪸","🪨","🌍","🌎","🌏","🌐","🗺️"] },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  className?: string;
}

export function EmojiPicker({ onSelect, onClose, className }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  const filtered = search
    ? EMOJI_CATEGORIES.flatMap((c) => c.emoji).filter((e) => e.includes(search))
    : null;

  return (
    <div
      className={cn("w-80 rounded-2xl overflow-hidden flex flex-col glass-modal animate-scale-in", className)}
    >
      {/* Search */}
      <div className="p-2" style={{ borderBottom: "0.5px solid var(--lyra-border-glass)" }}>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: "var(--lyra-glass-input)",
            border: "0.5px solid var(--lyra-border-glass)",
            backdropFilter: "var(--lyra-blur-sm)",
            WebkitBackdropFilter: "var(--lyra-blur-sm)",
          }}
        >
          <Search size={13} style={{ color: "var(--lyra-text-muted)" }} />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emoji..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--lyra-text-primary)" }}
          />
        </div>
      </div>

      {/* Category tabs */}
      {!search && (
        <div
          className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto"
          style={{ borderBottom: "0.5px solid var(--lyra-border-glass)" }}
        >
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className="text-lg px-2 py-1 rounded-lg flex-shrink-0 transition-all duration-150"
              style={{
                background: activeCategory === i ? "var(--lyra-glass-active)" : undefined,
                border: activeCategory === i ? "0.5px solid var(--lyra-border-glow)" : "0.5px solid transparent",
              }}
              title={cat.name}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="p-2 overflow-y-auto" style={{ maxHeight: 240 }}>
        {filtered ? (
          <div className="grid grid-cols-8 gap-0.5">
            {filtered.map((e, i) => (
              <button
                key={i}
                onClick={() => { onSelect(e); onClose(); }}
                className="text-xl p-1.5 rounded-lg transition-all duration-100"
                onMouseEnter={(ev) => { ev.currentTarget.style.background = "var(--lyra-glass-hover)"; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.background = ""; }}
              >
                {e}
              </button>
            ))}
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 px-1" style={{ color: "var(--lyra-text-muted)" }}>
              {EMOJI_CATEGORIES[activeCategory].name}
            </p>
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJI_CATEGORIES[activeCategory].emoji.map((e, i) => (
                <button
                  key={i}
                  onClick={() => { onSelect(e); onClose(); }}
                  className="text-xl p-1.5 rounded-lg transition-all duration-100"
                  onMouseEnter={(ev) => { ev.currentTarget.style.background = "var(--lyra-glass-hover)"; }}
                  onMouseLeave={(ev) => { ev.currentTarget.style.background = ""; }}
                >
                  {e}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
