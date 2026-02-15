import { HomeIcon } from "@heroicons-animated/solid";
import { A } from "@solidjs/router";
import type { AnimatedIconHandle } from "~/types/icon";

const GoHomeButton = () => {
  let homeRef: AnimatedIconHandle | undefined;

  return (
    <A
      class="supports-[corner-shape:squircle]:corner-squircle inline-flex w-fit cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-primary px-[12px] py-[4px] font-sans text-sm text-white transition-[background-color] duration-100 hover:bg-primary/90 focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-1 supports-[corner-shape:squircle]:rounded-[12px]"
      href="/"
      onMouseEnter={() => homeRef?.startAnimation()}
      onMouseLeave={() => homeRef?.stopAnimation()}
    >
      <HomeIcon
        ref={(h: AnimatedIconHandle) => {
          homeRef = h;
        }}
        size={14}
      />
      Go Home
    </A>
  );
};

export default GoHomeButton;
