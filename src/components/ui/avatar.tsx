import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

const sizeClasses = {
  sm: "size-7 text-sm",
  md: "size-10",
  lg: "size-12 text-lg",
};

type AvatarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
};

function Avatar(props: AvatarProps) {
  const [local, others] = splitProps(props, ["class", "size"]);
  return (
    <div
      class={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[local.size ?? "md"],
        local.class
      )}
      data-slot="avatar"
      {...others}
    />
  );
}

type AvatarImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

function AvatarImage(props: AvatarImageProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <img
      alt=""
      class={cn("size-full object-cover", local.class)}
      data-slot="avatar-image"
      height={40}
      width={40}
      {...others}
    />
  );
}

type AvatarFallbackProps = JSX.HTMLAttributes<HTMLSpanElement>;

function AvatarFallback(props: AvatarFallbackProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      class={cn(
        "flex size-full select-none items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800",
        local.class
      )}
      data-slot="avatar-fallback"
      {...others}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
