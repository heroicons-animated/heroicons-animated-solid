import { type JSX, children as resolveChildren, createEffect, createSignal, onCleanup } from "solid-js";
import { cn } from "~/lib/utils";

type TextLoopProps = {
  children: JSX.Element;
  class?: string;
  interval?: number;
  onIndexChange?: (index: number) => void;
};

export function TextLoop(props: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const resolved = resolveChildren(() => props.children);

  const items = () => {
    const c = resolved();
    return Array.isArray(c) ? c : [c];
  };

  createEffect(() => {
    const intervalMs = (props.interval ?? 2) * 1000;
    const len = items().length;

    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % len;
        props.onIndexChange?.(next);
        return next;
      });
    }, intervalMs);

    onCleanup(() => clearInterval(timer));
  });

  return (
    <div
      aria-hidden="true"
      class={cn("relative inline-block whitespace-nowrap", props.class)}
    >
      {items()[currentIndex()]}
    </div>
  );
}
