import { type JSX, For, createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type TabsProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  class?: string;
  children: JSX.Element;
};

const TabsContext = (() => {
  let _value: () => string = () => "";
  let _setValue: (v: string) => void = () => {};
  return {
    get: () => ({ value: _value, setValue: _setValue }),
    set: (v: () => string, s: (v: string) => void) => {
      _value = v;
      _setValue = s;
    },
  };
})();

const Tabs = (props: TabsProps) => {
  const [local, others] = splitProps(props, [
    "value",
    "onValueChange",
    "class",
    "children",
  ]);
  const [internalValue, setInternalValue] = createSignal(local.value || "");

  const value = () => local.value ?? internalValue();
  const setValue = (v: string) => {
    setInternalValue(v);
    local.onValueChange?.(v);
  };

  TabsContext.set(value, setValue);

  return (
    <div class={cn("flex flex-col", local.class)} data-slot="tabs">
      {local.children}
    </div>
  );
};

type TabsListProps = JSX.HTMLAttributes<HTMLDivElement>;

const TabsList = (props: TabsListProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn(
        "inline-flex items-center justify-start gap-px",
        local.class
      )}
      data-slot="tabs-list"
      {...others}
    >
      {local.children}
    </div>
  );
};

type TabsTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

const TabsTrigger = (props: TabsTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "value", "children"]);
  const ctx = TabsContext.get();

  return (
    <button
      class={cn(
        "z-50 inline-flex cursor-pointer items-center justify-center whitespace-nowrap bg-white px-4 py-1 font-mono text-black text-sm tracking-[-0.39px] hover:bg-neutral-50 aria-selected:bg-primary aria-selected:text-white dark:bg-white/10 dark:text-white dark:aria-selected:bg-primary dark:hover:bg-white/5",
        "first:rounded-tl-[8px] last:rounded-tr-[8px]",
        "supports-[corner-shape:squircle]:first:corner-tl-squircle supports-[corner-shape:squircle]:first:rounded-tl-[14px]",
        "supports-[corner-shape:squircle]:last:corner-tr-squircle supports-[corner-shape:squircle]:last:rounded-tr-[14px]",
        "transition-[background-color] duration-50",
        "focus-within:outline-offset-0 focus-visible:outline-1 focus-visible:outline-primary",
        local.class
      )}
      data-slot="tabs-trigger"
      aria-selected={ctx.value() === local.value}
      onClick={() => ctx.setValue(local.value)}
      type="button"
      {...others}
    >
      {local.children}
    </button>
  );
};

type TabsContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

const TabsContent = (props: TabsContentProps) => {
  const [local, others] = splitProps(props, ["value", "class", "children"]);
  const ctx = TabsContext.get();

  return (
    <div
      class={local.class}
      data-slot="tabs-content"
      style={{ display: ctx.value() === local.value ? undefined : "none" }}
      {...others}
    >
      {local.children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
