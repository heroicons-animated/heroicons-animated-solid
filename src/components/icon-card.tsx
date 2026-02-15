import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Card, CardActions } from "~/components/card";
import { ICON_MAP } from "~/lib/icons";
import type { AnimatedIconHandle, IconManifestItem } from "~/types/icon";

interface IconCardProps {
  icon: IconManifestItem;
}

const IconCard = (props: IconCardProps) => {
  let animationRef: AnimatedIconHandle | undefined;
  const Icon = () => ICON_MAP.get(props.icon.name);

  return (
    <Show when={Icon()}>
      {(IconComponent) => (
        <Card
          animationRef={animationRef}
          class="w-full min-[880px]:w-[200px]"
          onMouseEnter={() => animationRef?.startAnimation()}
          onMouseLeave={() => animationRef?.stopAnimation()}
        >
          <Dynamic<typeof IconComponent extends () => infer C ? C : never>
            class="flex items-center justify-center [&>svg]:size-12 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
            component={IconComponent()}
            ref={(h: AnimatedIconHandle) => {
              animationRef = h;
            }}
          />
          <CardActions alwaysVisible name={props.icon.name} />
        </Card>
      )}
    </Show>
  );
};

export { IconCard };
