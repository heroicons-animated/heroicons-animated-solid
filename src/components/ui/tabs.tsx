import {
  Content as TabsContentPrimitive,
  List as TabsListPrimitive,
  Root as TabsRoot,
  Trigger as TabsTriggerPrimitive,
} from "@kobalte/core/tabs";
import { type ComponentProps, type JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  class?: string;
  children: JSX.Element;
}

const Tabs = (props: TabsProps) => {
  const [local, others] = splitProps(props, ["class", "onValueChange"]);

  return (
    <TabsRoot
      class={cn("flex flex-col", local.class)}
      data-slot="tabs"
      onChange={local.onValueChange}
      {...others}
    />
  );
};

interface TabsListProps extends JSX.HTMLAttributes<HTMLDivElement> {}

const TabsList = (props: TabsListProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <TabsListPrimitive
      class={cn("inline-flex items-center justify-start gap-px", local.class)}
      data-slot="tabs-list"
      {...others}
    >
      {local.children}
    </TabsListPrimitive>
  );
};

type TabsTriggerProps = ComponentProps<typeof TabsTriggerPrimitive>;

const TabsTrigger = (props: TabsTriggerProps) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <TabsTriggerPrimitive
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
      {...others}
    />
  );
};

interface TabsContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = (props: TabsContentProps) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <TabsContentPrimitive
      class={local.class}
      data-slot="tabs-content"
      {...others}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
