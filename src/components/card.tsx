import type { JSX } from "solid-js";
import { createSignal, onCleanup, Show, splitProps } from "solid-js";
import type { IconStatus } from "~/components/ui/icon-state";
import { IconState } from "~/components/ui/icon-state";
import {
  ClipboardDocumentIcon,
  CommandLineIcon,
  PauseIcon,
  PlayIcon,
} from "~/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { LINK } from "~/constants";
import { useTouchDevice } from "~/hooks/use-touch-device";
import { getCLICommand, getFileExtension } from "~/lib/cli";
import { cn } from "~/lib/utils";
import { usePackageNameContext } from "~/providers/package-name";
import type { AnimatedIconHandle, IconManifestItem } from "~/types/icon";

const ICON_SOURCE_BASE_URL = `${LINK.GITHUB.replace("https://github.com", "https://raw.githubusercontent.com")}/main/packages/solid/src/icons`;

const getIconContent = async (name: string): Promise<string> => {
  const response = await fetch(`${ICON_SOURCE_BASE_URL}/${name}.tsx`);
  if (!response.ok) {
    throw new Error(`Icon source not found: ${name}`);
  }

  return response.text();
};

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
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
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
      onMouseEnter={isTouchDevice() ? undefined : local.onMouseEnter}
      onMouseLeave={isTouchDevice() ? undefined : local.onMouseLeave}
    >
      <Show when={isTouchDevice()}>
        <button
          aria-label={isAnimating() ? "Stop animation" : "Play animation"}
          aria-pressed={isAnimating()}
          class="supports-[corner-shape:squircle]:corner-squircle absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-[14px] bg-neutral-200/20 transition-[background-color] duration-100 focus-within:-outline-offset-1 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
          onClick={handlePlayClick}
          type="button"
        >
          <Show fallback={<PlayIcon />} when={isAnimating()}>
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
    if (state() !== "idle") {
      return;
    }

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
        aria-disabled={state() !== "idle"}
        aria-label="Copy shadcn-solid command"
        class="supports-[corner-shape:squircle]:corner-squircle flex size-10 cursor-pointer items-center justify-center rounded-[14px] bg-neutral-200/20 transition-[background-color] duration-100 focus-within:-outline-offset-1 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
        data-busy={state() !== "idle" ? "" : undefined}
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
          shadcn-solid
        </code>{" "}
        command
      </TooltipContent>
    </Tooltip>
  );
};

const CopyCodeAction = (props: Pick<IconManifestItem, "name">) => {
  const [state, setState] = createSignal<IconStatus>("idle");
  const ext = getFileExtension();

  const handleCopy = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (state() !== "idle") {
      return;
    }

    try {
      setState("loading");
      const content = await getIconContent(props.name);
      await navigator.clipboard.writeText(content);
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
        aria-disabled={state() !== "idle"}
        aria-label="Copy .tsx code"
        class="supports-[corner-shape:squircle]:corner-squircle flex size-10 cursor-pointer items-center justify-center rounded-[14px] bg-neutral-200/20 transition-[background-color] duration-100 focus-within:-outline-offset-1 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
        data-busy={state() !== "idle" ? "" : undefined}
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
          .{ext}
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
  const alwaysVisible = props.alwaysVisible ?? false;

  return (
    <TooltipProvider>
      <div
        class={cn(
          "my-6 flex items-center justify-center gap-2 transition-opacity duration-100",
          alwaysVisible
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
