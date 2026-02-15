import { createEffect, createSignal, onCleanup, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Show } from "solid-js";
import type { IconStatus } from "~/components/ui/icon-state";
import { IconState } from "~/components/ui/icon-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useTouchDevice } from "~/hooks/use-touch-device";
import { getCLICommand, getFileExtension } from "~/lib/cli";
import { cn } from "~/lib/utils";
import { usePackageNameContext } from "~/providers/package-name";
import type { AnimatedIconHandle, IconManifestItem } from "~/types/icon";

/** Inline clipboard icon */
const ClipboardDocumentIcon = () => (
  <svg
    class="size-4 text-neutral-800 dark:text-neutral-100"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

/** Inline command line icon */
const CommandLineIcon = () => (
  <svg
    class="size-4 text-neutral-800 dark:text-neutral-100"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

/** Inline play / pause icons */
const PlayIcon = () => (
  <svg class="size-4 text-neutral-800 dark:text-neutral-100" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const PauseIcon = () => (
  <svg class="size-4 text-neutral-800 dark:text-neutral-100" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.75 5.25v13.5m-7.5-13.5v13.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  animationRef?: AnimatedIconHandle;
}

const Card = (props: CardProps) => {
  const [local, others] = splitProps(props, [
    "children",
    "animationRef",
    "class",
    "onMouseEnter",
    "onMouseLeave",
  ]);

  const isTouchDevice = useTouchDevice();
  const [isAnimating, setIsAnimating] = createSignal(false);
  let timeoutRef: ReturnType<typeof setTimeout> | null = null;

  onCleanup(() => {
    if (timeoutRef) clearTimeout(timeoutRef);
  });

  const handlePlayClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isAnimating()) {
      local.animationRef?.stopAnimation();
      setIsAnimating(false);
      if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = null;
      }
    } else {
      local.animationRef?.startAnimation();
      setIsAnimating(true);
      timeoutRef = setTimeout(() => {
        setIsAnimating(false);
        local.animationRef?.stopAnimation();
      }, 1500);
    }
  };

  return (
    <div
      class={cn(
        "group/card supports-[corner-shape:squircle]:corner-squircle relative flex flex-col items-center justify-center rounded-[20px] bg-white px-[28px] pt-[50px] supports-[corner-shape:squircle]:rounded-[30px] dark:bg-[#0A0A0A]",
        local.class
      )}
      {...others}
      onMouseEnter={isTouchDevice() ? undefined : local.onMouseEnter as any}
      onMouseLeave={isTouchDevice() ? undefined : local.onMouseLeave as any}
    >
      <Show when={isTouchDevice()}>
        <button
          aria-label={isAnimating() ? "Stop animation" : "Play animation"}
          aria-pressed={isAnimating()}
          class="supports-[corner-shape:squircle]:corner-squircle absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-[14px] bg-neutral-200/20 transition-[background-color] duration-100 focus-within:-outline-offset-1 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
          onClick={handlePlayClick}
          type="button"
        >
          <Show when={isAnimating()} fallback={<PlayIcon />}>
            <PauseIcon />
          </Show>
        </button>
      </Show>
      {local.children}
    </div>
  );
};

const Title = (props: { children: JSX.Element }) => {
  return (
    <p
      class="mt-[36px] line-clamp-1 text-center font-mono text-[#9F9FA9] text-xs dark:text-[#D4D4D4]"
      title={typeof props.children === "string" ? props.children : undefined}
    >
      {props.children}
    </p>
  );
};

const CopyCLIAction = (props: Pick<IconManifestItem, "name">) => {
  const { packageName } = usePackageNameContext();
  const [state, setState] = createSignal<IconStatus>("idle");

  const handleCopy = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (state() !== "idle") return;

    try {
      await navigator.clipboard.writeText(
        getCLICommand(packageName(), props.name)
      );
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label="Copy shadcn/cli command"
        class="supports-[corner-shape:squircle]:corner-squircle flex size-10 cursor-pointer items-center justify-center rounded-[14px] bg-neutral-200/20 transition-[background-color] duration-100 focus-within:-outline-offset-1 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
        onClick={handleCopy}
        tabIndex={0}
      >
        <IconState status={state()}>
          <CommandLineIcon />
        </IconState>
      </TooltipTrigger>
      <TooltipContent>
        Copy{" "}
        <code class="rounded-[4px] bg-neutral-50/20 px-1 py-0.5 font-mono">
          shadcn/cli
        </code>{" "}
        command
      </TooltipContent>
    </Tooltip>
  );
};

const CopyCodeAction = (props: Pick<IconManifestItem, "name">) => {
  const [state, setState] = createSignal<IconStatus>("idle");

  const handleCopy = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (state() !== "idle") return;

    try {
      setState("loading");
      // For now, copy the icon name as a placeholder
      await navigator.clipboard.writeText(props.name);
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label="Copy .tsx code"
        class="supports-[corner-shape:squircle]:corner-squircle flex size-10 cursor-pointer items-center justify-center rounded-[14px] bg-neutral-200/20 transition-[background-color] duration-100 focus-within:-outline-offset-1 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
        onClick={handleCopy}
        tabIndex={0}
      >
        <IconState status={state()}>
          <ClipboardDocumentIcon />
        </IconState>
      </TooltipTrigger>
      <TooltipContent>
        Copy{" "}
        <code class="rounded-[4px] bg-neutral-50/20 px-1 py-0.5 font-mono">
          .tsx
        </code>{" "}
        code
      </TooltipContent>
    </Tooltip>
  );
};

type ActionsProps = Pick<IconManifestItem, "name"> & {
  alwaysVisible?: boolean;
};

const Actions = (props: ActionsProps) => {
  return (
    <TooltipProvider>
      <div
        class={cn(
          "my-6 flex items-center justify-center gap-2 transition-opacity duration-100",
          props.alwaysVisible
            ? "opacity-100"
            : "opacity-0 group-hover/card:opacity-100 has-data-busy:opacity-100 has-data-popup-open:opacity-100 has-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        )}
      >
        <CopyCodeAction name={props.name} />
        <CopyCLIAction name={props.name} />
      </div>
    </TooltipProvider>
  );
};

const CardTitle = Title;
const CardActions = Actions;

export { Card, CardTitle, CardActions };
