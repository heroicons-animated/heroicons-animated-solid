import { A, useParams } from "@solidjs/router";
import { Show, createMemo } from "solid-js";
import { Card, CardActions, CardTitle } from "~/components/card";
import { CliBlock } from "~/components/cli-block";
import { ICON_MAP } from "~/lib/icons";
import { ICON_MANIFEST } from "~/lib/manifest";
import type { AnimatedIconHandle } from "~/types/icon";

export default function IconDetailPage() {
  const params = useParams<{ slug: string }>();

  const iconData = createMemo(() =>
    ICON_MANIFEST.find((i) => i.name === params.slug)
  );

  const Icon = createMemo(() => ICON_MAP.get(params.slug));

  let animationRef: AnimatedIconHandle | undefined;

  return (
    <main class="view-container min-h-[calc(100vh-var(--header-height))] border-neutral-200 px-4 py-8 xl:border-x dark:border-neutral-800">
      <Show
        when={iconData()}
        fallback={
          <div class="flex flex-col items-center gap-4 pt-20">
            <h1 class="font-mono text-4xl">Icon not found</h1>
            <A
              class="text-primary underline underline-offset-3"
              href="/"
            >
              Go back
            </A>
          </div>
        }
      >
        {(data) => (
          <div class="flex flex-col items-center gap-8">
            {/* Breadcrumb */}
            <nav class="flex w-full items-center gap-2 font-mono text-sm text-secondary">
              <A class="hover:text-primary transition-colors" href="/">
                Home
              </A>
              <span>/</span>
              <span class="text-foreground">{data().name}</span>
            </nav>

            {/* Icon card */}
            <div class="w-full max-w-[300px]">
              <Card
                animationRef={animationRef}
                class="transition-shadow hover:shadow-sm"
                onMouseEnter={() => animationRef?.startAnimation()}
                onMouseLeave={() => animationRef?.stopAnimation()}
              >
                <Show when={Icon()}>
                  {(IconComponent) => (
                    <IconComponent()
                      class="flex items-center justify-center [&>svg]:size-16 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
                      ref={(h: AnimatedIconHandle) => {
                        animationRef = h;
                      }}
                    />
                  )}
                </Show>
                <CardTitle>{data().name}</CardTitle>
                <CardActions name={data().name} alwaysVisible />
              </Card>
            </div>

            {/* CLI block */}
            <CliBlock staticIconName={data().name} />

            {/* Keywords */}
            <Show when={data().keywords.length > 0}>
              <div class="flex flex-wrap items-center justify-center gap-2">
                {data().keywords.map((keyword: string) => (
                  <span class="rounded-full bg-neutral-200 px-3 py-1 font-mono text-xs dark:bg-neutral-800">
                    {keyword}
                  </span>
                ))}
              </div>
            </Show>
          </div>
        )}
      </Show>
    </main>
  );
}
