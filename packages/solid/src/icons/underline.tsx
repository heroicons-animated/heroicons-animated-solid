import { Motion } from "solid-motionone";
import type { JSX } from "solid-js";
import { createSignal, mergeProps, splitProps } from "solid-js";
import { resolveValues, resolveTransition } from "@/lib/motion-compat";
import { cn } from "@/lib/utils";

export interface UnderlineIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UnderlineIconProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: (handle: UnderlineIconHandle) => void;
}

const U_VARIANTS = {
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.3,
      ease: "linear",
      opacity: { duration: 0.1 },
    },
  },
};

const LINE_VARIANTS = {
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      delay: 0.3,
      duration: 0.1,
      ease: "linear",
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
};
const UnderlineIcon = (rawProps: UnderlineIconProps) => {
  const props = mergeProps({ size: 28 }, rawProps);
  const [local, others] = splitProps(props, [
    "onMouseEnter", "onMouseLeave", "class", "size", "ref",
  ]);
  const [variant, setVariant] = createSignal("normal");
  let isControlled = false;

  if (local.ref) {
    isControlled = true;
    local.ref({
      startAnimation: () => setVariant("animate"),
      stopAnimation: () => setVariant("normal"),
    });
  }

  const handleMouseEnter: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (isControlled) {
      if (typeof local.onMouseEnter === "function") local.onMouseEnter(e);
    } else {
      setVariant("animate");
    }
  };

  const handleMouseLeave: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (isControlled) {
      if (typeof local.onMouseLeave === "function") local.onMouseLeave(e);
    } else {
      setVariant("normal");
    }
  };

  return (
    <div
      class={cn(local.class)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...others}
    >
      <svg
                fill="none"
                height={local.size}
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width={local.size}
                xmlns="http://www.w3.org/2000/svg"
              >
                <Motion.path
                  animate={resolveValues(U_VARIANTS, variant())}
                  transition={resolveTransition(U_VARIANTS, variant())}
                  d="M17.995 3.744v7.5a6 6 0 1 1-12 0v-7.5"
                />
                <Motion.path
                  animate={resolveValues(LINE_VARIANTS, variant())}
                  transition={resolveTransition(LINE_VARIANTS, variant())}
                  d="M3.745 20.246h16.5"
                />
              </svg>
    </div>
  );
};

export { UnderlineIcon };
