import { MoonIcon, SunIcon } from "@heroicons-animated/solid";
import type { AnimatedIconHandle } from "~/types/icon";
import { Show, createSignal, onMount } from "solid-js";
import { useTheme } from "~/providers/theme";

const ThemeToggle = () => {
  const { setTheme, theme: currentTheme, resolvedTheme } = useTheme();
  let sunRef: AnimatedIconHandle | undefined;
  let moonRef: AnimatedIconHandle | undefined;
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);

    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        const isDark = resolvedTheme() === "dark";
        setTheme(isDark ? "light" : "dark");
      }
    };
    document.addEventListener("keydown", handler);
  });

  const isDark = () => resolvedTheme() === "dark";
  const nextTheme = () => (isDark() ? "light" : "dark");

  const handleMouseEnter = () => {
    sunRef?.startAnimation();
    moonRef?.startAnimation();
  };

  const handleMouseLeave = () => {
    sunRef?.stopAnimation();
    moonRef?.stopAnimation();
  };

  return (
    <button
      aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark()}
      class="supports-[corner-shape:squircle]:corner-squircle flex size-9 cursor-pointer items-center justify-center rounded-[14px] bg-white focus-within:outline-offset-2 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] dark:bg-white/10"
      onClick={() => setTheme(nextTheme())}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      type="button"
    >
      <Show when={mounted()}>
        <span class="flex items-center justify-center">
          <Show
            when={isDark()}
            fallback={
              <SunIcon
                aria-hidden="true"
                ref={(h: AnimatedIconHandle) => {
                  sunRef = h;
                }}
                size={16}
              />
            }
          >
            <MoonIcon
              aria-hidden="true"
              ref={(h: AnimatedIconHandle) => {
                moonRef = h;
              }}
              size={16}
            />
          </Show>
        </span>
      </Show>
    </button>
  );
};

export { ThemeToggle };
