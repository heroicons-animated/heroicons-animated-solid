import { A, useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { createMemo, For, Show } from "solid-js";
import { CliBlock } from "~/components/cli-block";
import { ArrowLeftIcon } from "~/components/ui/icons";
import { Skeleton } from "~/components/ui/skeleton";
import { kebabToPascalCase } from "~/lib/kebab-to-pascal";
import { ICON_MANIFEST } from "~/lib/manifest";

const GoHomeButton = clientOnly(() =>
  import("~/components/go-home-button").then((m) => ({ default: m.default })),
);
const IconCard = clientOnly(() =>
  import("~/components/icon-card").then((m) => ({ default: m.IconCard })),
);
const SimilarIcons = clientOnly(() =>
  import("~/components/similar-icons").then((m) => ({
    default: m.SimilarIcons,
  })),
);

const getIconBySlug = (slug: string) => {
  return ICON_MANIFEST.find((icon) => icon.name === slug);
};

export default function IconDetailPage() {
  const params = useParams<{ slug: string }>();

  const icon = createMemo(() => {
    const slug = params.slug;
    if (!slug) {
      return undefined;
    }
    return getIconBySlug(slug);
  });

  const pascalName = createMemo(() => {
    const slug = params.slug ?? "";
    return kebabToPascalCase(slug);
  });

  return (
    <Show
      fallback={
        <main class="view-container flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center border-neutral-200 px-4 py-16 xl:border-x dark:border-neutral-800">
          <div class="flex flex-col items-center gap-6">
            <h1 class="font-mono text-8xl">404</h1>
            <p class="text-center text-secondary">
              The page you're looking for might have been moved or doesn't
              exist.
            </p>
            <GoHomeButton
              fallback={<Skeleton class="h-9 w-24 rounded-[8px]" />}
            />
          </div>
        </main>
      }
      when={icon()}
    >
      {(iconData) => (
        <section class="flex min-h-[calc(100vh-var(--header-height))] flex-col">
          <div class="view-container flex flex-col items-start border-neutral-200 py-12 xl:border-x xl:pb-4 min-[880px]:pt-[60px] dark:border-neutral-800">
            <A
              class="mb-8 flex items-center gap-2 font-sans text-secondary text-sm transition-[color] duration-100 hover:text-primary focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-2"
              href="/"
            >
              <ArrowLeftIcon />
              Back to all icons
            </A>

            <div class="flex w-full flex-col gap-6 min-[880px]:flex-row min-[880px]:items-center">
              <IconCard
                fallback={
                  <Skeleton class="h-[186px] w-full rounded-[20px] min-[880px]:w-[200px]" />
                }
                icon={iconData()}
              />

              <div class="flex h-full flex-col gap-1">
                <h1 class="font-sans text-[28px] min-[640px]:text-[36px]">
                  {pascalName()}
                </h1>
                <p class="font-mono text-secondary text-sm">
                  Animated {iconData().name.replace(/-/g, " ")} icon for Solid
                </p>
                <CliBlock
                  class="mt-7 hidden px-0 min-[880px]:flex"
                  staticIconName={iconData().name}
                />
              </div>
            </div>

            <CliBlock
              class="mt-8 flex px-0 min-[880px]:hidden"
              staticIconName={iconData().name}
            />
          </div>

          <div class="view-container border-neutral-200 py-4 xl:border dark:border-neutral-800">
            <h2 class="mb-3 font-sans text-xl">Keywords</h2>
            <div class="flex flex-wrap gap-2">
              <For each={iconData().keywords}>
                {(keyword) => (
                  <span class="supports-[corner-shape:squircle]:corner-squircle rounded-[12px] bg-neutral-200 px-3 py-1 font-mono text-secondary text-sm supports-[corner-shape:squircle]:rounded-[20px] dark:bg-[#262626]">
                    {keyword}
                  </span>
                )}
              </For>
            </div>
          </div>

          <SimilarIcons
            currentIcon={iconData()}
            fallback={
              <div class="view-container border-neutral-200 pt-12 pb-[60px] xl:border-x xl:pt-4 dark:border-neutral-800">
                <Skeleton class="mb-4 h-7 w-40" />
                <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
                  <For each={Array.from({ length: 6 }, (_, i) => i)}>
                    {() => <Skeleton class="h-[180px] rounded-[20px]" />}
                  </For>
                </div>
              </div>
            }
          />
        </section>
      )}
    </Show>
  );
}
