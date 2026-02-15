import { A } from "@solidjs/router";
import { type Component, createMemo, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Card, CardTitle } from "~/components/card";
import { getIconList, ICON_MAP } from "~/lib/icons";
import type {
  AnimatedIconHandle,
  AnimatedIconProps,
  IconListItem,
  IconManifestItem,
} from "~/types/icon";

interface SimilarIconsProps {
  currentIcon: IconManifestItem;
}

const SimilarIconItem = (props: {
  icon: IconListItem;
  Icon?: Component<AnimatedIconProps>;
}) => {
  let animationRef: AnimatedIconHandle | undefined;

  return (
    <Show when={props.Icon}>
      {(Icon) => (
        <A
          class="rounded-[20px] focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-2"
          href={`/icons/${props.icon.name}`}
        >
          <Card
            animationRef={animationRef}
            class="pb-[50px] transition-shadow hover:shadow-sm"
            onMouseEnter={() => animationRef?.startAnimation()}
            onMouseLeave={() => animationRef?.stopAnimation()}
          >
            <Dynamic<typeof Icon extends () => infer C ? C : never>
              class="flex items-center justify-center [&>svg]:size-10 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
              component={Icon()}
              ref={(h: AnimatedIconHandle) => {
                animationRef = h;
              }}
            />
            <CardTitle>{props.icon.name}</CardTitle>
          </Card>
        </A>
      )}
    </Show>
  );
};

const SimilarIcons = (props: SimilarIconsProps) => {
  const similarIcons = createMemo(() => {
    const currentKeywords = new Set(props.currentIcon.keywords || []);

    const scored = getIconList()
      .filter((icon) => icon.name !== props.currentIcon.name)
      .map((icon) => {
        const iconKeywords = icon.keywords || [];
        const sharedKeywords = iconKeywords.filter((keyword) =>
          currentKeywords.has(keyword)
        ).length;
        return { icon, score: sharedKeywords };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return scored.map((item) => item.icon);
  });

  return (
    <Show
      fallback={
        <div class="view-container flex-1 border-neutral-200 pb-[60px] xl:border-x dark:border-neutral-800" />
      }
      when={similarIcons().length > 0}
    >
      <div class="view-container border-neutral-200 pt-12 pb-[60px] xl:border-x xl:pt-4 dark:border-neutral-800">
        <h2 class="mb-4 font-sans text-xl">Similar Icons</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
          <For each={similarIcons()}>
            {(icon) => (
              <SimilarIconItem Icon={ICON_MAP.get(icon.name)} icon={icon} />
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

export { SimilarIcons };
