import type { JSX } from "solid-js";
import { createSignal, mergeProps, splitProps } from "solid-js";
import { Motion } from "solid-motionone";
import { resolveTransition, resolveValues } from "@/lib/motion-compat";
import { cn } from "@/lib/utils";

export interface AdjustmentsHorizontalIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AdjustmentsHorizontalIconProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "ref"> {
  size?: number;
  ref?: (handle: AdjustmentsHorizontalIconHandle) => void;
}

const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 12,
  mass: 0.4,
};

const AdjustmentsHorizontalIcon = (
  rawProps: AdjustmentsHorizontalIconProps
) => {
  const props = mergeProps({ size: 28 }, rawProps);
  const [local, others] = splitProps(props, [
    "onMouseEnter",
    "onMouseLeave",
    "class",
    "size",
    "ref",
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

  const handleMouseEnter: JSX.EventHandler<HTMLDivElement, MouseEvent> = (
    e
  ) => {
    if (isControlled) {
      if (typeof local.onMouseEnter === "function") {
        local.onMouseEnter(e);
      }
    } else {
      setVariant("animate");
    }
  };

  const handleMouseLeave: JSX.EventHandler<HTMLDivElement, MouseEvent> = (
    e
  ) => {
    if (isControlled) {
      if (typeof local.onMouseLeave === "function") {
        local.onMouseLeave(e);
      }
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
        <Motion.line
          animate={resolveValues(
            { normal: { x1: 10.5 }, animate: { x1: 13.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { x1: 10.5 }, animate: { x1: 13.5 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
          x1="10.5"
          x2="20.25"
          y1="6"
          y2="6"
        />
        <Motion.line
          animate={resolveValues(
            { normal: { x2: 7.5 }, animate: { x2: 10.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { x2: 7.5 }, animate: { x2: 10.5 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
          x1="3.75"
          x2="7.5"
          y1="6"
          y2="6"
        />
        <Motion.circle
          animate={resolveValues(
            { normal: { cx: 9 }, animate: { cx: 12 } },
            variant()
          )}
          cx="9"
          cy="6"
          fill="none"
          r="1.5"
          transition={resolveTransition(
            { normal: { cx: 9 }, animate: { cx: 12 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
        />

        <Motion.line
          animate={resolveValues(
            { normal: { x1: 16.5 }, animate: { x1: 13.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { x1: 16.5 }, animate: { x1: 13.5 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
          x1="16.5"
          x2="20.25"
          y1="12"
          y2="12"
        />
        <Motion.line
          animate={resolveValues(
            { normal: { x2: 13.5 }, animate: { x2: 10.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { x2: 13.5 }, animate: { x2: 10.5 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
          x1="3.75"
          x2="13.5"
          y1="12"
          y2="12"
        />
        <Motion.circle
          animate={resolveValues(
            { normal: { cx: 15 }, animate: { cx: 12 } },
            variant()
          )}
          cx="15"
          cy="12"
          fill="none"
          r="1.5"
          transition={resolveTransition(
            { normal: { cx: 15 }, animate: { cx: 12 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
        />

        <Motion.line
          animate={resolveValues(
            { normal: { x1: 10.5 }, animate: { x1: 13.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { x1: 10.5 }, animate: { x1: 13.5 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
          x1="10.5"
          x2="20.25"
          y1="18"
          y2="18"
        />
        <Motion.line
          animate={resolveValues(
            { normal: { x2: 7.5 }, animate: { x2: 10.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { x2: 7.5 }, animate: { x2: 10.5 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
          x1="3.75"
          x2="7.5"
          y1="18"
          y2="18"
        />
        <Motion.circle
          animate={resolveValues(
            { normal: { cx: 9 }, animate: { cx: 12 } },
            variant()
          )}
          cx="9"
          cy="18"
          fill="none"
          r="1.5"
          transition={resolveTransition(
            { normal: { cx: 9 }, animate: { cx: 12 } },
            variant(),
            undefined,
            DEFAULT_TRANSITION
          )}
        />
      </svg>
    </div>
  );
};

export { AdjustmentsHorizontalIcon };
