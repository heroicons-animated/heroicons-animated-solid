import { createSignal, For } from "solid-js";
import type { IconStatus } from "~/components/ui/icon-state";
import { IconState } from "~/components/ui/icon-state";
import { ClipboardIcon } from "~/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TextLoop } from "~/components/ui/text-loop";
import { PACKAGE_MANAGER } from "~/constants";
import { getCLICommand, getRegistryPathPrefix, getShadcnCLI } from "~/lib/cli";
import { getPackageManagerPrefix } from "~/lib/get-package-manager-prefix";
import { cn } from "~/lib/utils";
import { usePackageNameContext } from "~/providers/package-name";
import type { IconManifestItem } from "~/types/icon";

interface CliBlockProps {
  icons?: IconManifestItem[];
  staticIconName?: string;
  class?: string;
}

const CliBlock = (props: CliBlockProps) => {
  const [state, setState] = createSignal<IconStatus>("idle");
  let currentIconName = props.staticIconName || props.icons?.[0]?.name || "";

  const { packageName, setPackageName } = usePackageNameContext();

  const isStatic = !!props.staticIconName;
  const filteredIcons = () =>
    (props.icons || []).filter((icon) => icon.name.length <= 20);

  const handleCopyToClipboard = async () => {
    const iconName =
      props.staticIconName || currentIconName || props.icons?.[0]?.name || "";

    try {
      await navigator.clipboard.writeText(
        getCLICommand(packageName(), iconName)
      );
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <div
      class={cn("relative mt-[40px] w-full max-w-[642px] px-4", props.class)}
    >
      <Tabs
        class="w-full"
        onValueChange={(value) =>
          setPackageName(value as Parameters<typeof setPackageName>[0])
        }
        value={packageName()}
      >
        <TabsList
          class="w-full"
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          <For each={Object.values(PACKAGE_MANAGER)}>
            {(pm) => <TabsTrigger value={pm}>{pm}</TabsTrigger>}
          </For>
        </TabsList>
        <For each={Object.values(PACKAGE_MANAGER)}>
          {(pm) => (
            <TabsContent
              class="supports-[corner-shape:squircle]:corner-tr-squircle supports-[corner-shape:squircle]:corner-br-squircle supports-[corner-shape:squircle]:corner-bl-squircle mt-px overflow-hidden rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] focus-within:outline-offset-0 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-tr-[14px] supports-[corner-shape:squircle]:rounded-br-[14px] supports-[corner-shape:squircle]:rounded-bl-[14px]"
              value={pm}
            >
              <div class="relative w-full overflow-hidden">
                <div
                  class={cn(
                    "overflow-x-auto rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] bg-white dark:bg-white/10",
                    "supports-[corner-shape:squircle]:corner-tr-squircle supports-[corner-shape:squircle]:corner-br-squircle supports-[corner-shape:squircle]:corner-bl-squircle supports-[corner-shape:squircle]:rounded-tr-[14px] supports-[corner-shape:squircle]:rounded-br-[14px] supports-[corner-shape:squircle]:rounded-bl-[14px]",
                    "isolate whitespace-nowrap px-4 py-3 pr-20 font-mono text-sm tracking-[-0.39px]"
                  )}
                >
                  <span class="sr-only">
                    {getPackageManagerPrefix(pm)} {getShadcnCLI()}{" "}
                    {getRegistryPathPrefix()}
                    {props.staticIconName || currentIconName}
                  </span>
                  <span
                    aria-hidden="true"
                    class="text-neutral-600 dark:text-neutral-400"
                  >
                    {getPackageManagerPrefix(pm)}
                  </span>{" "}
                  <span aria-hidden="true" class="text-black dark:text-white">
                    {getShadcnCLI()} add {getRegistryPathPrefix()}
                  </span>
                  {isStatic ? (
                    <span class="shrink-0 text-primary">
                      {props.staticIconName}
                    </span>
                  ) : (
                    <TextLoop
                      interval={1.5}
                      items={filteredIcons()}
                      onIndexChange={(index) => {
                        currentIconName = filteredIcons()[index]?.name || "";
                      }}
                      renderItem={(icon) => (
                        <span class="shrink-0 text-primary">{icon.name}</span>
                      )}
                      transition={{
                        duration: 0.25,
                      }}
                      variants={{
                        initial: {
                          y: -12,
                          rotateX: -90,
                          opacity: 0,
                          filter: "blur(2px)",
                        },
                        animate: {
                          y: 0,
                          rotateX: 0,
                          opacity: 1,
                          filter: "blur(0px)",
                        },
                        exit: {
                          y: 12,
                          rotateX: 90,
                          opacity: 0,
                          filter: "blur(2px)",
                        },
                      }}
                    />
                  )}
                </div>
                <button
                  aria-disabled={state() !== "idle"}
                  aria-label="Copy to clipboard"
                  class="supports-[corner-shape:squircle]:corner-squircle absolute top-1/2 right-1.5 z-20 -translate-y-1/2 cursor-pointer rounded-[6px] p-2 transition-[background-color] duration-100 focus-within:outline-offset-1 hover:bg-neutral-100 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[8px] dark:hover:bg-neutral-700"
                  onClick={handleCopyToClipboard}
                  tabIndex={0}
                  type="button"
                >
                  <IconState status={state()}>
                    <ClipboardIcon />
                  </IconState>
                </button>
              </div>
            </TabsContent>
          )}
        </For>
      </Tabs>
    </div>
  );
};

export { CliBlock };
