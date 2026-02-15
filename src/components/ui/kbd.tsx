import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

function Kbd(props: JSX.HTMLAttributes<HTMLElement>) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <kbd
      class={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-medium font-sans text-neutral-400 text-xs dark:text-neutral-500",
        local.class
      )}
      data-slot="kbd"
      {...others}
    />
  );
}

export { Kbd };
