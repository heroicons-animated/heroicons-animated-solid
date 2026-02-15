import {
  createEffect,
  createSignal,
  type JSX,
  onCleanup,
  Show,
} from "solid-js";
import {
  Motion,
  type Options,
  Presence,
  type VariantDefinition,
} from "solid-motionone";
import { cn } from "~/lib/utils";

interface TextLoopVariants {
  initial: VariantDefinition;
  animate: VariantDefinition;
  exit: VariantDefinition;
}

interface TextLoopProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  class?: string;
  interval?: number;
  onIndexChange?: (index: number) => void;
  transition?: Options["transition"];
  variants?: TextLoopVariants;
}

const DEFAULT_TRANSITION: Options["transition"] = {
  duration: 0.3,
};

const DEFAULT_VARIANTS: TextLoopVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

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
      <Presence exitBeforeEnter>
        <Show keyed when={props.items[currentIndex()]}>
          {(item) => (
            <Motion.div
              animate={(props.variants ?? DEFAULT_VARIANTS).animate}
              exit={(props.variants ?? DEFAULT_VARIANTS).exit}
              initial={(props.variants ?? DEFAULT_VARIANTS).initial}
              transition={props.transition ?? DEFAULT_TRANSITION}
            >
              {props.renderItem(item)}
            </Motion.div>
          )}
        </Show>
      </Presence>
    </div>
  );
}
