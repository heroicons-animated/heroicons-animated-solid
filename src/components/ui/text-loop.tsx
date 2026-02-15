import { createEffect, createSignal, type JSX, onCleanup } from "solid-js";
import { cn } from "~/lib/utils";

interface TextLoopProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  class?: string;
  interval?: number;
  onIndexChange?: (index: number) => void;
}

export function TextLoop<T>(props: TextLoopProps<T>) {
  const [currentIndex, setCurrentIndex] = createSignal(0);

  createEffect(() => {
    const intervalMs = (props.interval ?? 2) * 1000;
    const len = props.items.length;
    if (len === 0) {
      return;
    }

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
      {props.items.length > 0
        ? props.renderItem(props.items[currentIndex()])
        : null}
    </div>
  );
}
