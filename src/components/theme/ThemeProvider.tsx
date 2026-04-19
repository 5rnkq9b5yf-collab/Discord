"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { THEMES, DEFAULT_THEME_ID, applyTheme, getTheme } from "@/lib/themes";
import type { Theme } from "@/lib/types";

interface ThemeContextValue {
  themeId: string;
  theme: Theme;
  setThemeId: (id: string) => void;
  customCSS: string;
  setCustomCSS: (css: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState(DEFAULT_THEME_ID);
  const [customCSS, setCustomCSS] = useState("");

  const theme = getTheme(themeId);

  useEffect(() => {
    applyTheme(theme.tokens);
  }, [themeId, theme]);

  // Apply custom CSS
  useEffect(() => {
    const id = "lyra-custom-css";
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!customCSS) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = customCSS;
  }, [customCSS]);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("lyra-theme", id);
    }
  };

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lyra-theme");
      if (saved && THEMES.find((t) => t.id === saved)) {
        setThemeIdState(saved);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId, customCSS, setCustomCSS }}>
      {children}
    </ThemeContext.Provider>
  );
}
