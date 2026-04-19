"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    icon: "😊",
    emoji: ["😀","😂","🥲","😊","😇","🥰","😍","🤩","😘","😗","😙","😚","🙂","🤗","🤭","🫢","🤫","🤔","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","💫","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","☹️","😮","😯","😲","😳","🥺","🫣","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  },
  {
    name: "Gestures",
    icon: "👋",
    emoji: ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃"],
  },
  {
    name: "Hearts",
    icon: "❤️",
    emoji: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","❤️‍🔥","❤️‍🩹","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","✡️","🔯","🕎","☯️","🛐","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","🔀","🔁","🔂","▶️","⏩","⏪","⏫","⏬","◀️"],
  },
  {
    name: "Animals",
    icon: "🐱",
    emoji: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐝","🪱","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐟","🐠","🐬","🦭","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🦣","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🫏","🫎","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🪶","🐓","🦃","🦤","🦚","🦜","🦢","🦩","🕊️","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿️","🦔"],
  },
  {
    name: "Food",
    icon: "🍕",
    emoji: ["🍕","🍔","🌮","🌯","🥙","🧆","🥚","🍳","🥘","🫕","🍲","🫔","🥗","🍿","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🫖","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🧊"],
  },
  {
    name: "Activities",
    icon: "⚽",
    emoji: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🏒","🏑","🥍","🏏","🪃","🥅","⛳","🪁","🛝","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖️","🏵️","🎗️","🎫","🎟️","🎪","🤹","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🪘","🥁","🪗","🎷","🎺","🎸","🪕","🎻","🎲","♟️","🎯","🎳","🎮","🎰","🧩"],
  },
  {
    name: "Symbols",
    icon: "✨",
    emoji: ["✨","⭐","🌟","💫","⚡","🔥","🌈","☁️","❄️","🌊","🌀","🌙","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌛","🌜","🌝","🌞","🪐","💥","🎆","🎇","🌺","🌸","🌼","🌻","🌹","🥀","🌷","🌱","🌿","🍃","🍂","🍁","🍄","🌾","💐","🌵","🎋","🎍","🪴","🌲","🌳","🌴","🐚","🪸","🪨","🌍","🌎","🌏","🌐","🗺️"],
  },
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
    ? EMOJI_CATEGORIES.flatMap((c) => c.emoji).filter((e) =>
        e.includes(search)
      )
    : null;

  return (
    <div
      className={cn(
        "w-80 rounded-xl border border-[var(--lyra-border)] shadow-2xl overflow-hidden flex flex-col",
        "bg-[var(--lyra-secondary-bg)] animate-slide-in-up",
        className
      )}
    >
      {/* Search */}
      <div className="p-2 border-b border-[var(--lyra-border)]">
        <div className="flex items-center gap-2 bg-[var(--lyra-input-bg)] rounded-lg px-3 py-2 border border-[var(--lyra-input-border)]">
          <Search size={14} className="text-[var(--lyra-text-muted)]" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emoji..."
            className="flex-1 bg-transparent text-sm text-[var(--lyra-text-primary)] placeholder:text-[var(--lyra-text-muted)] outline-none"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-[var(--lyra-border)] overflow-x-auto">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={cn(
                "text-lg px-2 py-1 rounded-md flex-shrink-0 transition-colors",
                activeCategory === i
                  ? "bg-[var(--lyra-accent)]/20 text-[var(--lyra-accent)]"
                  : "hover:bg-[var(--lyra-tertiary-bg)]"
              )}
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
                className="text-xl p-1.5 rounded hover:bg-[var(--lyra-tertiary-bg)] transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lyra-text-muted)] mb-1 px-1">
              {EMOJI_CATEGORIES[activeCategory].name}
            </p>
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJI_CATEGORIES[activeCategory].emoji.map((e, i) => (
                <button
                  key={i}
                  onClick={() => { onSelect(e); onClose(); }}
                  className="text-xl p-1.5 rounded hover:bg-[var(--lyra-tertiary-bg)] transition-colors"
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
