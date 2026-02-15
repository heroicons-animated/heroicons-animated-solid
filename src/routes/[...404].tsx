import { HomeIcon } from "@heroicons-animated/solid";
import { A } from "@solidjs/router";
import type { AnimatedIconHandle } from "~/types/icon";

export default function NotFound() {
  let homeRef: AnimatedIconHandle | undefined;

  return (
    <main class="view-container flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center border-neutral-200 px-4 py-16 xl:border-x dark:border-neutral-800">
      <div class="flex flex-col items-center gap-6">
        <h1 class="font-mono text-8xl">404</h1>
        <p class="text-center text-secondary">
          The page you're looking for might have been moved or doesn't exist.
        </p>
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
      </div>
    </main>
  );
}
