import { Motion } from "solid-motionone";
import type { JSX } from "solid-js";
import { createSignal, mergeProps, splitProps } from "solid-js";
import { resolveValues, resolveTransition } from "@/lib/motion-compat";
import { cn } from "@/lib/utils";

export interface DocumentTextIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface DocumentTextIconProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: (handle: DocumentTextIconHandle) => void;
}

const LINE_VARIANTS = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
};
const DocumentTextIcon = (rawProps: DocumentTextIconProps) => {
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
      stopAnimation: () => setVariant("visible"),
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
      setVariant("visible");
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
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              {[
                { d: "M8.25 12.75h7.5", index: 0 },
                { d: "M8.25 15.75H12", index: 1 },
              ].map((line) => (
                <Motion.path
                  animate={resolveValues(LINE_VARIANTS, variant())}
                  transition={resolveTransition(LINE_VARIANTS, variant())}
                  custom={line.index}
                  d={line.d}
                  initial="visible"
                  key={line.index}
                />
              ))}
            </svg>
    </div>
  );
};

export { DocumentTextIcon };
