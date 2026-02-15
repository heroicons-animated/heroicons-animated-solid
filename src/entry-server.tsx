import { COLOR_MODE_STORAGE_KEY, ColorModeScript } from "@kobalte/core";
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { ICON_MANIFEST } from "~/lib/manifest";
import {
  FAQJsonLd,
  OrganizationJsonLd,
  SoftwareSourceCodeJsonLd,
  WebsiteJsonLd,
} from "~/seo/json-ld";

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

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
              name="viewport"
            />
            <meta content={getThemeColorFromCookie()} name="theme-color" />

            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
            <link href="/favicon.png" rel="icon" type="image/png" />
            <link href="/favicon.png" rel="apple-touch-icon" />

            <ColorModeScript
              initialColorMode="system"
              storageKey={COLOR_MODE_STORAGE_KEY}
              storageType="cookie"
            />

            <WebsiteJsonLd />
            <SoftwareSourceCodeJsonLd numberOfItems={ICON_MANIFEST.length} />
            <OrganizationJsonLd />
            <FAQJsonLd />
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
  );
});
