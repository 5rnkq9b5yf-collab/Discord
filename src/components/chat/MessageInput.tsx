"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./EmojiPicker";
import type { Message } from "@/lib/types";
import { Smile, Paperclip, Bold, Italic, Underline, Code, Strikethrough, Send, X } from "lucide-react";

interface MessageInputProps {
  channelName: string;
  replyTo?: Message | null;
  onClearReply?: () => void;
  onSend: (content: string) => void;
  className?: string;
}

type FormatAction = "bold" | "italic" | "underline" | "strike" | "code" | "codeblock" | "spoiler";

const FORMAT_MARKERS: Record<FormatAction, [string, string]> = {
  bold: ["**", "**"], italic: ["*", "*"], underline: ["__", "__"],
  strike: ["~~", "~~"], code: ["`", "`"], codeblock: ["```\n", "\n```"], spoiler: ["||", "||"],
};

const FORMAT_BUTTONS = [
  { icon: <Bold size={13} />, action: "bold" as FormatAction, title: "Bold" },
  { icon: <Italic size={13} />, action: "italic" as FormatAction, title: "Italic" },
  { icon: <Underline size={13} />, action: "underline" as FormatAction, title: "Underline" },
  { icon: <Strikethrough size={13} />, action: "strike" as FormatAction, title: "Strikethrough" },
  { icon: <Code size={13} />, action: "code" as FormatAction, title: "Inline Code" },
  { icon: <span className="text-xs font-mono font-bold">{"</>"}</span>, action: "codeblock" as FormatAction, title: "Code Block" },
  { icon: <span className="text-xs font-bold">||</span>, action: "spoiler" as FormatAction, title: "Spoiler" },
];

export function MessageInput({ channelName, replyTo, onClearReply, onSend, className }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    if (onClearReply) onClearReply();
  };

  const applyFormat = (action: FormatAction) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const [open, close] = FORMAT_MARKERS[action];
    const newValue = `${value.slice(0, start)}${open}${selected}${close}${value.slice(end)}`;
    setValue(newValue);
    setTimeout(() => {
      ta.focus();
      const pos = start + open.length + selected.length + close.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    setValue((prev) => prev.slice(0, pos) + emoji + prev.slice(pos));
    setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + emoji.length, pos + emoji.length); }, 0);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  return (
    <div className={cn("relative px-4 pb-4", className)}>
      {/* Reply banner */}
      {replyTo && (
        <div
          className="flex items-center justify-between px-4 py-2 mb-0 rounded-t-2xl text-sm"
          style={{
            background: "var(--lyra-glass-card)",
            backdropFilter: "var(--lyra-blur-sm)",
            WebkitBackdropFilter: "var(--lyra-blur-sm)",
            border: "0.5px solid var(--lyra-border-glass)",
            borderBottom: "none",
          }}
        >
          <span style={{ color: "var(--lyra-text-muted)" }}>
            Replying to{" "}
            <span className="font-semibold" style={{ color: replyTo.author.displayColor || "var(--lyra-accent)" }}>
              {replyTo.author.displayName}
            </span>
          </span>
          <button onClick={onClearReply} style={{ color: "var(--lyra-text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--lyra-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--lyra-text-muted)"; }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Input box */}
      <div
        className={cn("flex flex-col overflow-hidden", replyTo ? "rounded-b-2xl" : "rounded-2xl")}
        style={{
          background: "var(--lyra-glass-input)",
          backdropFilter: "var(--lyra-blur-md)",
          WebkitBackdropFilter: "var(--lyra-blur-md)",
          border: "0.5px solid var(--lyra-border-glass)",
        }}
      >
        {/* Format toolbar */}
        <div className="flex items-center gap-0.5 px-3 pt-2 pb-1" style={{ borderBottom: "0.5px solid var(--lyra-border-glass)" }}>
          {FORMAT_BUTTONS.map((btn) => (
            <button
              key={btn.action}
              onClick={() => applyFormat(btn.action)}
              title={btn.title}
              className="w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-100"
              style={{ color: "var(--lyra-text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = "var(--lyra-text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--lyra-text-muted)"; }}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Textarea row */}
        <div className="flex items-end gap-2 px-3 py-2">
          <button
            title="Attach file"
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-100"
            style={{ color: "var(--lyra-text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = "var(--lyra-accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--lyra-text-muted)"; }}
          >
            <Paperclip size={16} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
            style={{ maxHeight: 200, color: "var(--lyra-text-primary)" }}
          />

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowEmoji((v) => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-100"
              style={{ color: showEmoji ? "var(--lyra-accent)" : "var(--lyra-text-muted)" }}
              onMouseEnter={(e) => { if (!showEmoji) { e.currentTarget.style.background = "var(--lyra-glass-hover)"; e.currentTarget.style.color = "var(--lyra-accent)"; } }}
              onMouseLeave={(e) => { if (!showEmoji) { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--lyra-text-muted)"; } }}
              title="Emoji"
            >
              <Smile size={16} />
            </button>
            {showEmoji && (
              <div className="absolute bottom-10 right-0 z-50">
                <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "var(--lyra-glass-active)",
              border: "0.5px solid var(--lyra-border-glow)",
              color: "var(--lyra-accent)",
              boxShadow: value.trim() ? "0 0 12px var(--lyra-accent-glow)" : undefined,
            }}
            title="Send"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
