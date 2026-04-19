"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Copy, Check } from "lucide-react";

const EXAMPLE_CSS = `/* Example: change accent color */
:root {
  --lyra-accent: #ff6b9d;
  --lyra-sidebar-bg: #1a1a2e;
  --lyra-button-primary: #ff6b9d;
}

/* Custom message font size */
.message-content {
  font-size: 15px;
  line-height: 1.6;
}

/* Rounded message bubbles */
.message-row:hover {
  border-radius: 12px;
}`;

interface CustomCSSEditorProps {
  value: string;
  onChange: (css: string) => void;
  className?: string;
}

export function CustomCSSEditor({ value, onChange, className }: CustomCSSEditorProps) {
  const [copied, setCopied] = useState(false);
  const [styleId] = useState("lyra-user-css-" + Math.random().toString(36).slice(2));

  // Apply CSS live
  useEffect(() => {
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = value;
    return () => {
      styleEl?.remove();
    };
  }, [value, styleId]);

  const handleReset = () => {
    onChange(EXAMPLE_CSS);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--lyra-text-primary)]">Custom CSS</h3>
          <p className="text-xs text-[var(--lyra-text-muted)] mt-0.5">
            Advanced — changes apply live. Use CSS variables (--lyra-*) to customize tokens.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<RotateCcw size={13} />} onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={copied ? <Check size={13} /> : <Copy size={13} />}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <div
        className="relative rounded-xl border border-[var(--lyra-input-border)] overflow-hidden font-mono text-sm"
        style={{ background: "#1e1e2e" }}
      >
        {/* Line numbers + textarea approach (simple, no external dep loading issues) */}
        <div className="flex">
          <div
            className="flex-shrink-0 py-3 px-3 text-right select-none text-xs leading-6"
            style={{ color: "#555", minWidth: 40 }}
          >
            {value.split("\n").map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent p-3 outline-none resize-none text-xs leading-6"
            style={{
              color: "#cdd6f4",
              minHeight: 300,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              caretColor: "#cdd6f4",
            }}
            spellCheck={false}
            placeholder={EXAMPLE_CSS}
          />
        </div>
      </div>

      <p className="text-xs text-[var(--lyra-text-muted)]">
        Changes apply instantly. The CSS is scoped to this page — be careful with `position: fixed` elements.
      </p>
    </div>
  );
}
