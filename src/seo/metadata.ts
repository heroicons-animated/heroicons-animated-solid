import { SITE } from "~/constants";

export const DEFAULT_TITLE = `${SITE.NAME} | Free Animated Heroicons for Solid`;
export const DEFAULT_DESCRIPTION = SITE.DESCRIPTION.LONG;
export const OG_IMAGE_ALT = `${SITE.NAME} - Animated Heroicons Library for Solid`;

const OG_IMAGE_URL = SITE.OG_IMAGE.startsWith("http")
  ? SITE.OG_IMAGE
  : `${SITE.URL}${SITE.OG_IMAGE}`;

export { OG_IMAGE_URL };

export interface CreateMetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
  keywords?: readonly string[];
}

export interface ResolvedMeta {
  title: string;
  description: string;
  canonical: string;
  url: string;
  ogTitle: string;
  ogDescription: string;
  noIndex: boolean;
  keywords: string;
  twitter: {
    title: string;
    description: string;
    creator: string;
    site: string;
    image: string;
    imageAlt: string;
  };
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "website";
    siteName: string;
    locale: string;
    image: string;
    imageAlt: string;
  };
}

export function createMeta(options: CreateMetaOptions = {}): ResolvedMeta {
  const {
    title,
    description = SITE.DESCRIPTION.SHORT,
    canonical,
    ogTitle,
    ogDescription,
    noIndex = false,
    keywords = SITE.KEYWORDS,
  } = options;

  const resolvedTitle = title ?? DEFAULT_TITLE;
  const resolvedDescription = description;
  const resolvedOgDescription = ogDescription ?? description;
  const resolvedOgTitle = ogTitle ?? title ?? SITE.NAME;
  const url = canonical ? `${SITE.URL}${canonical}` : SITE.URL;
  const resolvedKeywords = keywords.join(", ");

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    canonical: canonical ?? "/",
    url,
    ogTitle: resolvedOgTitle,
    ogDescription: resolvedOgDescription,
    noIndex,
    keywords: resolvedKeywords,
    twitter: {
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      creator: SITE.AUTHOR.TWITTER,
      site: SITE.AUTHOR.TWITTER,
      image: OG_IMAGE_URL,
      imageAlt: OG_IMAGE_ALT,
    },
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      url,
      type: "website" as const,
      siteName: SITE.NAME,
      locale: "en_US",
      image: OG_IMAGE_URL,
      imageAlt: OG_IMAGE_ALT,
    },
  };
}

export const baseMeta = createMeta({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
});
