import { ArrowTopRightOnSquareIcon } from "@heroicons-animated/solid";
import type { AnimatedIconHandle } from "~/types/icon";

const CourseButton = () => {
  let arrowRef: AnimatedIconHandle | undefined;

  return (
    <a
      class="supports-[corner-shape:squircle]:corner-squircle flex w-fit cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-primary px-[12px] py-[4px] font-sans text-sm text-white transition-[background-color] duration-100 hover:bg-[color-mix(in_oklab,var(--color-primary),black_10%)] focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-1 supports-[corner-shape:squircle]:rounded-[12px] max-[445px]:w-full"
      href="https://animations.dev/"
      onMouseEnter={() => arrowRef?.startAnimation()}
      onMouseLeave={() => arrowRef?.stopAnimation()}
      rel="noopener external"
      tabIndex={0}
      target="_blank"
    >
      Take the course
      <ArrowTopRightOnSquareIcon
        ref={(h: AnimatedIconHandle) => {
          arrowRef = h;
        }}
        size={14}
      />
    </a>
  );
};

export { CourseButton };
