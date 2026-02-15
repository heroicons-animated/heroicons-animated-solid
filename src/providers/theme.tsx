import {
  type ParentComponent,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { isServer } from "solid-js/web";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: () => Theme;
  resolvedTheme: () => "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>();

const ThemeProvider: ParentComponent = (props) => {
  const [theme, setThemeState] = createSignal<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = createSignal<"light" | "dark">(
    "light"
  );

  const resolveTheme = (t: Theme): "light" | "dark" => {
    if (t === "system") {
      if (isServer) return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return t;
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (!isServer) {
      localStorage.setItem("theme", t);
    }
  };

  onMount(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme() === "system") {
        setResolvedTheme(resolveTheme("system"));
      }
    };
    mq.addEventListener("change", handler);
  });

  createEffect(() => {
    const resolved = resolveTheme(theme());
    setResolvedTheme(resolved);
    if (!isServer) {
      document.documentElement.classList.toggle("dark", resolved === "dark");
    }
  });

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export { ThemeProvider, useTheme };
