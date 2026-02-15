import { A, useSearchParams } from "@solidjs/router";
import Fuse from "fuse.js";
import { type Component, createMemo, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Card, CardActions, CardTitle } from "~/components/card";
import { ICON_MAP } from "~/lib/icons";
import type {
  AnimatedIconHandle,
  AnimatedIconProps,
  IconManifestItem,
} from "~/types/icon";
import { SearchInput } from "./search-input";

interface Props {
  icons: IconManifestItem[];
}

const IconItem = (props: {
  icon: IconManifestItem;
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
            class="transition-shadow [contain-intrinsic-size:auto_180px] [content-visibility:auto] hover:shadow-sm"
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
            <CardActions {...props.icon} />
          </Card>
        </A>
      )}
    </Show>
  );
};

const IconsList = (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams<{
    search: string;
  }>();

  const searchValue = () => searchParams.search ?? "";
  const setSearchValue = (value: string) => {
    setSearchParams({ search: value || undefined });
  };

  const fuse = createMemo(
    () =>
      new Fuse(props.icons, {
        keys: [
          { name: "name", weight: 3 },
          { name: "keywords", weight: 2 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        findAllMatches: true,
        isCaseSensitive: false,
        minMatchCharLength: 2,
      })
  );

  const filteredIcons = createMemo(() => {
    const q = searchValue().trim();
    if (!q) {
      return props.icons;
    }
    return fuse()
      .search(q)
      .map((result) => result.item);
  });

  return (
    <>
      <SearchInput
        resultCount={filteredIcons().length}
        searchValue={searchValue()}
        setSearchValue={setSearchValue}
        totalCount={props.icons.length}
      />
      <div class="view-container grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 border-neutral-200 pt-2 pb-[60px] xl:border-x dark:border-neutral-800">
        <Show when={filteredIcons().length === 0}>
          <div class="col-span-full pt-10 text-center text-neutral-500 text-sm">
            No icons found
          </div>
        </Show>
        <For each={filteredIcons()}>
          {(icon) => <IconItem Icon={ICON_MAP.get(icon.name)} icon={icon} />}
        </For>
      </div>
    </>
  );
};

export { IconsList };
