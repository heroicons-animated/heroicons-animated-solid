const SITE = {
  NAME: "heroicons-animated",
  URL: "https://www.heroicons-animated.com",
  OG_IMAGE: "/og.png",
  AUTHOR: {
    NAME: "Aniket Pawar",
    TWITTER: "@alaymanguy",
    GITHUB: "Aniket-508",
  },
  DESCRIPTION: {
    LONG: "Free open-source library of beautifully animated icons for SolidJS. Built with Motion One and Heroicons. Copy-paste ready, MIT licensed, fully customizable SVG icons with smooth animations.",
    SHORT:
      "Free animated icons library for SolidJS. Smooth Motion One-powered Heroicons. MIT licensed, copy-paste ready.",
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
  GITHUB: "https://github.com/Aniket-508/heroicons-animated",
  HEROICONS: "https://heroicons.com",
  MOTION: "https://motion.dev",
  LICENSE: "https://github.com/Aniket-508/heroicons-animated/blob/main/LICENSE",
  SPONSOR: "https://github.com/sponsors/Aniket-508",
} as const;

const PACKAGE_MANAGER = {
  PNPM: "pnpm",
  NPM: "npm",
  YARN: "yarn",
  BUN: "bun",
} as const;

export { LINK, PACKAGE_MANAGER, SITE };
