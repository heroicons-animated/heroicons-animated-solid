import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Card, CardActions, CardTitle } from "~/components/card";
import { ICON_MAP } from "~/lib/icons";
import type { AnimatedIconHandle } from "~/types/icon";

interface IconCardPreviewProps {
  slug: string;
  name: string;
}

const IconCardPreview = (props: IconCardPreviewProps) => {
  let animationRef: AnimatedIconHandle | undefined;
  const Icon = () => ICON_MAP.get(props.slug);

  return (
    <div class="w-full max-w-[300px]">
      <Card
        animationRef={animationRef}
        class="transition-shadow hover:shadow-sm"
        onMouseEnter={() => animationRef?.startAnimation()}
        onMouseLeave={() => animationRef?.stopAnimation()}
      >
        <Show when={Icon()}>
          {(IconComponent) => (
            <Dynamic<typeof IconComponent extends () => infer C ? C : never>
              class="flex items-center justify-center [&>svg]:size-16 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
              component={IconComponent()}
              ref={(h: AnimatedIconHandle) => {
                animationRef = h;
              }}
            />
          )}
        </Show>
        <CardTitle>{props.name}</CardTitle>
        <CardActions alwaysVisible name={props.name} />
      </Card>
    </div>
  );
};

export default IconCardPreview;
