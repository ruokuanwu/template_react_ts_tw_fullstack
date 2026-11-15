import { createContext, useContext } from "react";

export type Theme = "dark" | "light";
export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  storageError: string | null;
} | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within the dashboard.");
  return context;
}
