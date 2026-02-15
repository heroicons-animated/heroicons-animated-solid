import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { GithubStarsButton } from "~/components/github-button";
import { Logo } from "~/components/logo";
import { SolidJsLogo } from "~/components/solidjs-logo";
import { SponsorHeartFilled } from "~/components/sponsor-heart-filled";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { LINK } from "~/constants";

const Header = () => {
  const [isSponsorIconAnimating, setIsSponsorIconAnimating] =
    createSignal(false);

  const handleSponsorEnter = () => {
    setIsSponsorIconAnimating(true);
  };

  const handleSponsorLeave = () => {
    setIsSponsorIconAnimating(false);
  };

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
          <a
            aria-label="Sponsor Project"
            class="supports-[corner-shape:squircle]:corner-squircle flex size-9 items-center justify-center gap-1 rounded-[14px] bg-white font-sans text-[#3F3F47] text-sm underline-offset-4 focus-within:outline-offset-2 hover:underline focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] sm:size-auto sm:bg-transparent sm:pr-1 dark:bg-white/10 dark:text-[#FAFAFA] sm:dark:bg-transparent"
            href={LINK.SPONSOR}
            onBlur={handleSponsorLeave}
            onFocus={handleSponsorEnter}
            onMouseEnter={handleSponsorEnter}
            onMouseLeave={handleSponsorLeave}
            tabIndex={0}
          >
            <SponsorHeartFilled
              animate={isSponsorIconAnimating()}
              aria-hidden="true"
              class="text-primary"
              size={16}
            />
            <span class="hidden sm:inline">Sponsor Project</span>
          </a>
          <ThemeToggle />
          <GithubStarsButton />
        </div>
      </div>
    </header>
  );
};

export { Header };
