"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./EmojiPicker";
import type { Message } from "@/lib/types";
import {
  Smile,
  Paperclip,
  Image,
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
  Send,
  X,
  GalleryHorizontalEnd,
} from "lucide-react";

interface MessageInputProps {
  channelName: string;
  replyTo?: Message | null;
  onClearReply?: () => void;
  onSend: (content: string) => void;
  className?: string;
}

type FormatAction = "bold" | "italic" | "underline" | "strike" | "code" | "codeblock" | "spoiler";

const FORMAT_MARKERS: Record<FormatAction, [string, string]> = {
  bold: ["**", "**"],
  italic: ["*", "*"],
  underline: ["__", "__"],
  strike: ["~~", "~~"],
  code: ["`", "`"],
  codeblock: ["```\n", "\n```"],
  spoiler: ["||", "||"],
};

export function MessageInput({
  channelName,
  replyTo,
  onClearReply,
  onSend,
  className,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    if (onClearReply) onClearReply();
  };

  const applyFormat = (action: FormatAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const [open, close] = FORMAT_MARKERS[action];
    const before = value.slice(0, start);
    const after = value.slice(end);
    const newValue = `${before}${open}${selected}${close}${after}`;
    setValue(newValue);
    setTimeout(() => {
      textarea.focus();
      const pos = start + open.length + selected.length + close.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    setValue((prev) => prev.slice(0, pos) + emoji + prev.slice(pos));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(pos + emoji.length, pos + emoji.length);
    }, 0);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  const FORMAT_BUTTONS = [
    { icon: <Bold size={14} />, action: "bold" as FormatAction, title: "Bold (Ctrl+B)" },
    { icon: <Italic size={14} />, action: "italic" as FormatAction, title: "Italic (Ctrl+I)" },
    { icon: <Underline size={14} />, action: "underline" as FormatAction, title: "Underline (Ctrl+U)" },
    { icon: <Strikethrough size={14} />, action: "strike" as FormatAction, title: "Strikethrough" },
    { icon: <Code size={14} />, action: "code" as FormatAction, title: "Inline Code" },
    { icon: <span className="text-xs font-mono font-bold">{"</>"}</span>, action: "codeblock" as FormatAction, title: "Code Block" },
    { icon: <span className="text-xs font-bold">||</span>, action: "spoiler" as FormatAction, title: "Spoiler" },
  ];

  return (
    <div className={cn("relative px-4 pb-4", className)}>
      {/* Reply banner */}
      {replyTo && (
        <div
          className="flex items-center justify-between px-4 py-2 mb-1 rounded-t-lg text-sm border-t border-x border-[var(--lyra-border)]"
          style={{ background: "var(--lyra-tertiary-bg)" }}
        >
          <span className="text-[var(--lyra-text-muted)]">
            Replying to{" "}
            <span
              className="font-semibold"
              style={{ color: replyTo.author.displayColor || "var(--lyra-accent)" }}
            >
              {replyTo.author.displayName}
            </span>
          </span>
          <button
            onClick={onClearReply}
            className="text-[var(--lyra-text-muted)] hover:text-[var(--lyra-text-primary)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input box */}
      <div
        className={cn(
          "flex flex-col rounded-xl border border-[var(--lyra-input-border)] overflow-hidden",
          replyTo && "rounded-t-none border-t-0"
        )}
        style={{ background: "var(--lyra-input-bg)" }}
      >
        {/* Format toolbar */}
        <div className="flex items-center gap-0.5 px-3 pt-2 pb-1 border-b border-[var(--lyra-border)]">
          {FORMAT_BUTTONS.map((btn) => (
            <button
              key={btn.action}
              onClick={() => applyFormat(btn.action)}
              title={btn.title}
              className="w-7 h-6 flex items-center justify-center rounded text-[var(--lyra-text-muted)]
                hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)] transition-colors"
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Textarea + action row */}
        <div className="flex items-end gap-2 px-3 py-2">
          <button
            title="Attach file"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
              text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)] transition-colors"
          >
            <Paperclip size={18} />
          </button>

          <button
            title="Add GIF"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
              text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-text-primary)] transition-colors text-xs font-bold"
          >
            GIF
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-[var(--lyra-text-primary)]
              placeholder:text-[var(--lyra-text-muted)] leading-relaxed"
            style={{ maxHeight: 200 }}
          />

          {/* Emoji picker button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowEmoji((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full
                text-[var(--lyra-text-muted)] hover:bg-[var(--lyra-tertiary-bg)] hover:text-[var(--lyra-accent)] transition-colors"
              title="Emoji"
            >
              <Smile size={18} />
            </button>
            {showEmoji && (
              <div className="absolute bottom-10 right-0 z-50">
                <EmojiPicker
                  onSelect={insertEmoji}
                  onClose={() => setShowEmoji(false)}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
              bg-[var(--lyra-accent)] text-white transition-all
              hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Send"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
