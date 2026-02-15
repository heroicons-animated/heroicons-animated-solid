const SITE = {
  NAME: "heroicons-animated-solid",
  URL: "https://solid.heroicons-animated.com",
  OG_IMAGE: "/og.png",
  AUTHOR: {
    NAME: "Aniket Pawar",
    TWITTER: "@alaymanguy",
    GITHUB: "Aniket-508",
  },
  DESCRIPTION: {
    LONG: "Free open-source library of beautifully animated icons for SolidJS. Built with solid-motionone and Heroicons. Copy-paste ready, MIT licensed, fully customizable SVG icons with smooth animations.",
    SHORT:
      "Free animated icons library for SolidJS. Smooth solid-motionone-powered Heroicons. MIT licensed, copy-paste ready.",
  },
  KEYWORDS: [
    "animated icons",
    "solidjs icons",
    "motion one icons",
    "heroicons",
    "heroicons animated",
    "animated heroicons",
    "heroicons solidjs",
    "svg icons",
    "animated svg",
    "solidjs components",
    "icon library",
    "open source icons",
    "motion one animated icons",
    "animated solidjs components",
    "free icons",
    "MIT license icons",
    "copy paste icons",
    "tailwind icons",
  ],
} as const;

const LINK = {
  TWITTER: "https://x.com/alaymanguy",
  GITHUB: "https://github.com/heroicons-animated/heroicons-animated-solid",
  HEROICONS: "https://heroicons.com",
  MOTION: "https://github.com/solidjs-community/solid-motionone",
  LICENSE:
    "https://github.com/heroicons-animated/heroicons-animated-solid/blob/main/LICENSE",
  SPONSOR: "https://github.com/sponsors/Aniket-508",
} as const;

const PACKAGE_MANAGER = {
  PNPM: "pnpm",
  NPM: "npm",
  YARN: "yarn",
  BUN: "bun",
} as const;

export { LINK, PACKAGE_MANAGER, SITE };
