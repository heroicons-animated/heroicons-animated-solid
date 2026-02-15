import { A } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { Logo } from "~/components/logo";
import { SolidJsLogo } from "~/components/solidjs-logo";
import { Skeleton } from "~/components/ui/skeleton";

const SponsorButton = clientOnly(() =>
  import("~/components/sponsor-button").then((m) => ({
    default: m.SponsorButton,
  })),
);

const ThemeToggle = clientOnly(() =>
  import("~/components/ui/theme-toggle").then((m) => ({
    default: m.ThemeToggle,
  })),
);

const GithubStarsButton = clientOnly(() =>
  import("~/components/github-button").then((m) => ({
    default: m.GithubStarsButton,
  })),
);

const Header = () => {
  return (
    <header class="h-(--header-height) border-neutral-200 xl:border-b dark:border-neutral-800">
      <div class="view-container flex h-full w-full justify-between gap-4 border-neutral-200 xl:border-x dark:border-neutral-800">
        <A
          aria-label="Heroicons Animated - Home"
          class="mr-auto flex items-center gap-2 font-sans text-base focus-within:outline-offset-4 focus-visible:outline-1 focus-visible:outline-primary max-[524px]:translate-y-[-2px] min-[395px]:text-xl"
          href="/"
          tabIndex={0}
        >
          <Logo class="w-6 text-primary min-[395px]:w-8" />
          <span class="relative inline-flex flex-col">
            <span>heroicons-animated</span>
            <span class="absolute right-0 -bottom-[14px] flex items-center gap-1 font-mono text-[10px] text-secondary">
              - for
              <SolidJsLogo class="h-3.5 w-3.5" />
            </span>
          </span>
        </A>
        <div class="ml-auto flex w-full flex-1 flex-wrap-reverse items-center justify-end gap-2">
          <SponsorButton
            fallback={<Skeleton class="h-9 w-24 rounded-[8px]" />}
          />
          <ThemeToggle fallback={<Skeleton class="size-9 rounded-[8px]" />} />
          <GithubStarsButton
            fallback={<Skeleton class="h-9 w-20 rounded-[8px]" />}
          />
        </div>
      </div>
    </header>
  );
};

export { Header };
