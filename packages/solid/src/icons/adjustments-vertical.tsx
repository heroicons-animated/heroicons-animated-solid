import type { JSX } from "solid-js";
import { createSignal, mergeProps, splitProps } from "solid-js";
import { Motion } from "solid-motionone";
import { resolveTransition, resolveValues } from "@/lib/motion-compat";
import { cn } from "@/lib/utils";

export interface AdjustmentsVerticalIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AdjustmentsVerticalIconProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: (handle: AdjustmentsVerticalIconHandle) => void;
}

const AdjustmentsVerticalIcon = (rawProps: AdjustmentsVerticalIconProps) => {
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
            { normal: { y2: 13.5 }, animate: { y2: 10.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { y2: 13.5 }, animate: { y2: 10.5 } },
            variant()
          )}
          x1="6"
          x2="6"
          y1="3.75"
          y2="13.5"
        />
        <Motion.line
          animate={resolveValues(
            { normal: { y1: 16.5 }, animate: { y1: 13.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { y1: 16.5 }, animate: { y1: 13.5 } },
            variant()
          )}
          x1="6"
          x2="6"
          y1="16.5"
          y2="20.25"
        />
        <Motion.circle
          animate={resolveValues(
            { normal: { cy: 15 }, animate: { cy: 12 } },
            variant()
          )}
          cx="6"
          cy="15"
          fill="none"
          r="1.5"
          transition={resolveTransition(
            { normal: { cy: 15 }, animate: { cy: 12 } },
            variant()
          )}
        />

        <Motion.line
          animate={resolveValues(
            { normal: { y2: 7.5 }, animate: { y2: 10.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { y2: 7.5 }, animate: { y2: 10.5 } },
            variant()
          )}
          x1="12"
          x2="12"
          y1="3.75"
          y2="7.5"
        />
        <Motion.line
          animate={resolveValues(
            { normal: { y1: 10.5 }, animate: { y1: 13.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { y1: 10.5 }, animate: { y1: 13.5 } },
            variant()
          )}
          x1="12"
          x2="12"
          y1="10.5"
          y2="20.25"
        />
        <Motion.circle
          animate={resolveValues(
            { normal: { cy: 9 }, animate: { cy: 12 } },
            variant()
          )}
          cx="12"
          cy="9"
          fill="none"
          r="1.5"
          transition={resolveTransition(
            { normal: { cy: 9 }, animate: { cy: 12 } },
            variant()
          )}
        />

        <Motion.line
          animate={resolveValues(
            { normal: { y2: 13.5 }, animate: { y2: 10.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { y2: 13.5 }, animate: { y2: 10.5 } },
            variant()
          )}
          x1="18"
          x2="18"
          y1="3.75"
          y2="13.5"
        />
        <Motion.line
          animate={resolveValues(
            { normal: { y1: 16.5 }, animate: { y1: 13.5 } },
            variant()
          )}
          transition={resolveTransition(
            { normal: { y1: 16.5 }, animate: { y1: 13.5 } },
            variant()
          )}
          x1="18"
          x2="18"
          y1="16.5"
          y2="20.25"
        />
        <Motion.circle
          animate={resolveValues(
            { normal: { cy: 15 }, animate: { cy: 12 } },
            variant()
          )}
          cx="18"
          cy="15"
          fill="none"
          r="1.5"
          transition={resolveTransition(
            { normal: { cy: 15 }, animate: { cy: 12 } },
            variant()
          )}
        />
      </svg>
    </div>
  );
};

export { AdjustmentsVerticalIcon };
