import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "theme";

const getIsDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

const applyTheme = (theme) => {
  if (typeof document === "undefined") return;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }

  // Let other ThemeToggle instances sync immediately
  window.dispatchEvent(new CustomEvent("theme-change"));
};

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(getIsDark);

  useEffect(() => {
    // Initialize theme (prefer stored theme; otherwise use system preference)
    let storedTheme = null;
    try {
      storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // ignore
    }

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

    const initialTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";

    applyTheme(initialTheme);
    setIsDarkMode(getIsDark());

    const sync = () => setIsDarkMode(getIsDark());

    // Sync across different ThemeToggle instances + other code changing html class
    window.addEventListener("theme-change", sync);

    const onStorage = (e) => {
      if (e.key !== THEME_STORAGE_KEY) return;
      const next = e.newValue === "dark" ? "dark" : "light";
      applyTheme(next);
      sync();
    };
    window.addEventListener("storage", onStorage);

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("theme-change", sync);
      window.removeEventListener("storage", onStorage);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    applyTheme(isDarkMode ? "light" : "dark");
    setIsDarkMode(getIsDark());
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full transition-colors duration-300 flex items-center justify-center",
        "hover:bg-foreground/10 focus:outline-none"
      )}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-foreground/80 hover:text-primary" />
      ) : (
        <Moon className="h-5 w-5 text-foreground/80 hover:text-primary" />
      )}
    </button>
  );
};
