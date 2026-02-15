import { type JSX, Show, createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

/** Minimal tooltip implemented with CSS + signals (no external lib needed) */

type TooltipProviderProps = {
  children: JSX.Element;
};

const TooltipProvider = (props: TooltipProviderProps) => {
  return <>{props.children}</>;
};

type TooltipProps = {
  children: JSX.Element;
};

const Tooltip = (props: TooltipProps) => {
  return (
    <div class="relative inline-flex" data-slot="tooltip">
      {props.children}
    </div>
  );
};

type TooltipTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const TooltipTrigger = (props: TooltipTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <button
      class={cn("group/tooltip-trigger", local.class)}
      data-slot="tooltip-trigger"
      {...others}
    >
      {local.children}
    </button>
  );
};

type TooltipContentProps = {
  class?: string;
  children: JSX.Element;
};

const TooltipContent = (props: TooltipContentProps) => {
  return (
    <div
      class={cn(
        "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[14px] bg-primary px-3 py-1.5 text-white text-xs opacity-0 shadow-sm transition-opacity duration-100 group-hover/tooltip-trigger:opacity-100",
        "supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[20px]",
        props.class
      )}
      data-slot="tooltip-content"
    >
      {props.children}
    </div>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
