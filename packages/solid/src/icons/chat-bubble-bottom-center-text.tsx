import { Motion } from "solid-motionone";
import type { JSX } from "solid-js";
import { createSignal, mergeProps, splitProps } from "solid-js";
import { resolveValues, resolveTransition } from "@/lib/motion-compat";
import { cn } from "@/lib/utils";

export interface ChatBubbleBottomCenterTextIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ChatBubbleBottomCenterTextIconProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: (handle: ChatBubbleBottomCenterTextIconHandle) => void;
}

const LINE_VARIANTS = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
};
const ChatBubbleBottomCenterTextIcon = (rawProps: ChatBubbleBottomCenterTextIconProps) => {
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
              {[
                { d: "M7.5 8.25h9", index: 0 },
                { d: "M7.5 11.25H12", index: 1 },
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
              <path d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
    </div>
  );
};

export { ChatBubbleBottomCenterTextIcon };
