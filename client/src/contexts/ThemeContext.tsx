import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "neutro" | "media" | "violet" | "emerald" | "master" | "night" | "midnight" | "sunset" | "light" | "dark";

export const THEME_OPTIONS: Array<{ id: Theme; label: string; description: string }> = [
  { id: "neutro", label: "Neutro", description: "Preto limpo com brilho branco discreto" },
  { id: "media", label: "Dourado", description: "Carteira clássica em preto, ouro e âmbar" },
  { id: "violet", label: "Violet", description: "Violeta profundo com neon lilás" },
  { id: "emerald", label: "Emerald", description: "Verde esmeralda operacional" },
  { id: "master", label: "Master", description: "Vermelho rubi para administração" },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = "carteira-theme-v2";
const validThemes = new Set<Theme>(THEME_OPTIONS.map(option => option.id));

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({ children, defaultTheme = "media", switchable = true }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (!switchable || typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    return stored && validThemes.has(stored) ? stored : defaultTheme;
  });

  const setTheme = (next: Theme) => {
    if (validThemes.has(next)) setThemeState(next);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (switchable) localStorage.setItem(THEME_KEY, theme);
  }, [theme, switchable]);

  const toggleTheme = () => {
    const index = THEME_OPTIONS.findIndex(option => option.id === theme);
    setTheme(THEME_OPTIONS[(index + 1) % THEME_OPTIONS.length].id);
  };

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, switchable }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
