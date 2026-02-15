import {
  ColorModeProvider,
  cookieStorageManager,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import { SITE } from "~/constants";
import { PackageNameProvider } from "~/providers/package-name";
import { baseMeta } from "~/seo/metadata";
import "./global.css";
import { Header } from "~/components/header";

function getColorModeStorageManager() {
  if (isServer) {
    const cookie = getRequestEvent()?.request.headers.get("cookie") ?? "";
    return cookieStorageManagerSSR(cookie);
  }
  return cookieStorageManager;
}

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>{baseMeta.title}</Title>
          <Meta content={baseMeta.description} name="description" />
          <Meta content={baseMeta.keywords} name="keywords" />
          <Meta content={SITE.AUTHOR.NAME} name="author" />
          <Meta content="index, follow" name="robots" />
          <Meta content={SITE.NAME} name="application-name" />
          <Meta content={baseMeta.ogTitle} property="og:title" />
          <Meta content={baseMeta.ogDescription} property="og:description" />
          <Meta content={baseMeta.url} property="og:url" />
          <Meta content="website" property="og:type" />
          <Meta content={SITE.NAME} property="og:site_name" />
          <Meta content="en_US" property="og:locale" />
          <Meta content={baseMeta.openGraph.image} property="og:image" />
          <Meta content={baseMeta.openGraph.imageAlt} property="og:image:alt" />
          <Meta content="summary_large_image" name="twitter:card" />
          <Meta content={baseMeta.twitter.title} name="twitter:title" />
          <Meta
            content={baseMeta.twitter.description}
            name="twitter:description"
          />
          <Meta content={baseMeta.twitter.creator} name="twitter:creator" />
          <Meta content={baseMeta.twitter.site} name="twitter:site" />
          <Meta content={baseMeta.twitter.image} name="twitter:image" />
          <Meta content={baseMeta.twitter.imageAlt} name="twitter:image:alt" />
          <Link href={`${SITE.URL}${baseMeta.canonical}`} rel="canonical" />
          <ColorModeProvider
            initialColorMode="system"
            storageManager={getColorModeStorageManager()}
          >
            <PackageNameProvider>
              <Header />
              <Suspense>{props.children}</Suspense>
            </PackageNameProvider>
          </ColorModeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
