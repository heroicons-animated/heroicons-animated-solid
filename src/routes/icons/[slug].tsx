import { A, useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { createMemo, For, Show } from "solid-js";
import { CliBlock } from "~/components/cli-block";
import { ICON_MANIFEST } from "~/lib/manifest";

const IconCardPreview = clientOnly(
  () => import("~/components/icon-card-preview")
);

export default function IconDetailPage() {
  const params = useParams<{ slug: string }>();

  const iconData = createMemo(() =>
    ICON_MANIFEST.find((i) => i.name === params.slug)
  );

  return (
    <main class="view-container min-h-[calc(100vh-var(--header-height))] border-neutral-200 px-4 py-8 xl:border-x dark:border-neutral-800">
      <Show
        fallback={
          <div class="flex flex-col items-center gap-4 pt-20">
            <h1 class="font-mono text-4xl">Icon not found</h1>
            <A class="text-primary underline underline-offset-3" href="/">
              Go back
            </A>
          </div>
        }
        when={iconData()}
      >
        {(data) => (
          <div class="flex flex-col items-center gap-8">
            {/* Breadcrumb */}
            <nav class="flex w-full items-center gap-2 font-mono text-secondary text-sm">
              <A class="transition-colors hover:text-primary" href="/">
                Home
              </A>
              <span>/</span>
              <span class="text-foreground">{data().name}</span>
            </nav>

            {/* Icon card (client-only) */}
            <IconCardPreview name={data().name} slug={params.slug} />

            {/* CLI block */}
            <CliBlock staticIconName={data().name} />

            {/* Keywords */}
            <Show when={data().keywords.length > 0}>
              <div class="flex flex-wrap items-center justify-center gap-2">
                <For each={data().keywords}>
                  {(keyword) => (
                    <span class="rounded-full bg-neutral-200 px-3 py-1 font-mono text-xs dark:bg-neutral-800">
                      {keyword}
                    </span>
                  )}
                </For>
              </div>
            </Show>
          </div>
        )}
      </Show>
    </main>
  );
}
