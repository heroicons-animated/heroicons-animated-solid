import {
  Content as TooltipContentPrimitive,
  Portal as TooltipPortal,
  Root as TooltipRoot,
  Trigger as TooltipTriggerPrimitive,
} from "@kobalte/core/tooltip";
import { type JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface TooltipProviderProps {
  children: JSX.Element;
}

const TooltipProvider = (props: TooltipProviderProps) => {
  return <>{props.children}</>;
};

interface TooltipProps {
  children: JSX.Element;
}

const Tooltip = (props: TooltipProps) => {
  return <TooltipRoot>{props.children}</TooltipRoot>;
};

type TooltipTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const TooltipTrigger = (props: TooltipTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <TooltipTriggerPrimitive
      class={cn("group/tooltip-trigger", local.class)}
      data-slot="tooltip-trigger"
      type={others.type ?? "button"}
      {...others}
    >
      {local.children}
    </TooltipTriggerPrimitive>
  );
};

interface TooltipContentProps {
  class?: string;
  children: JSX.Element;
}

const TooltipContent = (props: TooltipContentProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <TooltipPortal>
      <TooltipContentPrimitive
        class={cn(
          "z-50 whitespace-nowrap rounded-[14px] bg-primary px-3 py-1.5 text-white text-xs shadow-sm",
          "supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[20px]",
          local.class
        )}
        data-slot="tooltip-content"
        {...others}
      >
        {local.children}
      </TooltipContentPrimitive>
    </TooltipPortal>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
