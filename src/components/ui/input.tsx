import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  inputContainerClass?: string;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
}

const Input = (props: InputProps) => {
  const [local, others] = splitProps(props, [
    "inputContainerClass",
    "class",
    "type",
    "leadingIcon",
    "trailingIcon",
    "disabled",
    "ref",
  ]);

  return (
    <div
      class={cn(
        "group relative w-full data-disabled:pointer-events-none",
        local.inputContainerClass
      )}
      data-disabled={local.disabled ? "" : undefined}
      data-slot="input-container"
    >
      {local.leadingIcon && (
        <span
          class="pointer-events-none absolute top-1/2 left-3 inline-flex shrink-0 -translate-y-1/2 [&_svg]:shrink-0"
          data-slot="input-leading-icon"
        >
          {local.leadingIcon}
        </span>
      )}
      <input
        ref={local.ref}
        class={cn(
          "flex h-9 w-full min-w-0 px-3 py-1 text-sm outline-none ring-1",
          "bg-neutral-100 text-neutral-800 ring-neutral-200 selection:bg-primary selection:text-white placeholder:text-neutral-400/70 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800",
          "transition-[color,box-shadow,ring-color]",
          "focus-visible:ring-primary dark:focus-visible:ring-primary",
          "supports-[corner-shape:squircle]:corner-squircle rounded-[14px] supports-[corner-shape:squircle]:rounded-[24px]",
          local.leadingIcon && "pl-10",
          local.trailingIcon && "pr-12",
          local.class
        )}
        data-slot="input"
        disabled={local.disabled}
        type={local.type}
        {...others}
      />
      {local.trailingIcon && (
        <span
          class="pointer-events-none absolute top-1/2 right-3 inline-flex shrink-0 -translate-y-1/2 [&_svg]:shrink-0"
          data-slot="input-trailing-icon"
        >
          {local.trailingIcon}
        </span>
      )}
    </div>
  );
};

export { Input };
