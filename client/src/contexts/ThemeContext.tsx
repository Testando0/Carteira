import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "night" | "midnight" | "violet" | "emerald" | "sunset" | "light" | "dark";

export const THEME_OPTIONS: Array<{ id: Theme; label: string; description: string }> = [
  { id: "night", label: "RGB Night", description: "Ciano, rosa e verde sobre o espaço profundo" },
  { id: "midnight", label: "Midnight Blue", description: "Azul elétrico com atmosfera noturna" },
  { id: "violet", label: "Nebula Violet", description: "Violeta cósmico com brilho magenta" },
  { id: "emerald", label: "Emerald Grid", description: "Verde esmeralda para foco operacional" },
  { id: "sunset", label: "Solar Sunset", description: "Âmbar e coral com energia quente" },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = "carteira-theme";
const validThemes = new Set<Theme>(THEME_OPTIONS.map(option => option.id));

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({ children, defaultTheme = "night", switchable = true }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (!switchable || typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    return stored && validThemes.has(stored) ? stored : defaultTheme;
  });

  const setTheme = (next: Theme) => {
    if (validThemes.has(next)) setThemeState(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
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
