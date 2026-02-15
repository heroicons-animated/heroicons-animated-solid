import { COLOR_MODE_STORAGE_KEY, ColorModeScript } from "@kobalte/core";
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { LINK, SITE } from "~/constants";
import { ICON_MANIFEST } from "~/lib/manifest";

const THEME_COLOR_LIGHT = "#f5f5f5";
const THEME_COLOR_DARK = "#171717";

function getThemeColorFromCookie(): string {
  const cookie = getRequestEvent()?.request.headers.get("cookie") ?? "";
  const match = cookie.match(
    new RegExp(`(^| )${COLOR_MODE_STORAGE_KEY}=([^;]+)`)
  );
  const value = match?.[2];
  return value === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
}

const TITLE = `${SITE.NAME} | Free Animated Heroicons for Solid`;
const DESCRIPTION = SITE.DESCRIPTION.LONG;
const OG_IMAGE_ALT = `${SITE.NAME} - Animated Heroicons Library for Solid`;
const OG_IMAGE_URL = SITE.OG_IMAGE.startsWith("http")
  ? SITE.OG_IMAGE
  : `${SITE.URL}${SITE.OG_IMAGE}`;

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.NAME,
  url: SITE.URL,
  description: DESCRIPTION,
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.URL}?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const SOFTWARE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: SITE.NAME,
  description: DESCRIPTION,
  url: SITE.URL,
  codeRepository: LINK.GITHUB,
  programmingLanguage: ["TypeScript", "SolidJS", "JavaScript"],
  runtimePlatform: "Node.js",
  license: LINK.LICENSE,
  author: {
    "@type": "Person",
    name: SITE.AUTHOR.NAME,
    url: LINK.TWITTER,
  },
  maintainer: {
    "@type": "Person",
    name: SITE.AUTHOR.NAME,
    url: LINK.TWITTER,
  },
  keywords: SITE.KEYWORDS.join(", "),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  isAccessibleForFree: true,
  dateModified: new Date().toISOString().split("T")[0],
  numberOfItems: ICON_MANIFEST.length,
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.NAME,
  url: SITE.URL,
  logo: OG_IMAGE_URL,
  sameAs: [LINK.GITHUB, LINK.TWITTER],
};

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
            name="viewport"
          />
          <title>{TITLE}</title>
          <meta content={DESCRIPTION} name="description" />
          <meta content={SITE.KEYWORDS.join(", ")} name="keywords" />
          <meta content={SITE.AUTHOR.NAME} name="author" />
          <meta content="index, follow" name="robots" />
          <meta content={getThemeColorFromCookie()} name="theme-color" />
          <meta content={SITE.NAME} name="application-name" />
          <link href={SITE.URL} rel="canonical" />

          <meta content={TITLE} property="og:title" />
          <meta content={DESCRIPTION} property="og:description" />
          <meta content={SITE.URL} property="og:url" />
          <meta content="website" property="og:type" />
          <meta content={SITE.NAME} property="og:site_name" />
          <meta content="en_US" property="og:locale" />
          <meta content={OG_IMAGE_URL} property="og:image" />
          <meta content={OG_IMAGE_ALT} property="og:image:alt" />

          <meta content="summary_large_image" name="twitter:card" />
          <meta content={TITLE} name="twitter:title" />
          <meta content={DESCRIPTION} name="twitter:description" />
          <meta content={SITE.AUTHOR.TWITTER} name="twitter:creator" />
          <meta content={SITE.AUTHOR.TWITTER} name="twitter:site" />
          <meta content={OG_IMAGE_URL} name="twitter:image" />
          <meta content={OG_IMAGE_ALT} name="twitter:image:alt" />

          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          <link href="/favicon.png" rel="icon" type="image/png" />
          <link href="/favicon.png" rel="apple-touch-icon" />

          <ColorModeScript
            initialColorMode="system"
            storageKey={COLOR_MODE_STORAGE_KEY}
            storageType="cookie"
          />

          <script
            innerHTML={JSON.stringify(WEBSITE_JSON_LD)}
            type="application/ld+json"
          />
          <script
            innerHTML={JSON.stringify(SOFTWARE_JSON_LD)}
            type="application/ld+json"
          />
          <script
            innerHTML={JSON.stringify(ORG_JSON_LD)}
            type="application/ld+json"
          />
          {assets}
        </head>
        <body class="relative bg-background font-sans antialiased">
          <div class="root" id="app">
            {children}
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
));
