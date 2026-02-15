import { LINK, SITE } from "~/constants";
import { kebabToPascalCase } from "~/lib/kebab-to-pascal";
import { OG_IMAGE_URL } from "~/seo/metadata";
import type { IconManifestItem } from "~/types/icon";

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.NAME,
    url: SITE.URL,
    description: SITE.DESCRIPTION.LONG,
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
  return (
    <script innerHTML={JSON.stringify(jsonLd)} type="application/ld+json" />
  );
}

export function SoftwareSourceCodeJsonLd(props: { numberOfItems: number }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: SITE.NAME,
    description: SITE.DESCRIPTION.LONG,
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
    numberOfItems: props.numberOfItems,
  };
  return (
    <script innerHTML={JSON.stringify(jsonLd)} type="application/ld+json" />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.NAME,
    url: SITE.URL,
    logo: OG_IMAGE_URL,
    sameAs: [LINK.GITHUB, LINK.TWITTER],
    founder: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: LINK.TWITTER,
    },
  };
  return (
    <script innerHTML={JSON.stringify(jsonLd)} type="application/ld+json" />
  );
}

export function FAQJsonLd() {
  const faqs = [
    {
      question: "What is heroicons-animated?",
      answer: `${SITE.NAME} is a free, open-source library of 316 beautifully crafted animated Solid icons. Built with Solid MotionOne and based on Heroicons.`,
    },
    {
      question: "How do I install heroicons-animated icons?",
      answer:
        "You can install the package with pnpm add @heroicons-animated/solid (or npm/yarn). Import icons from @heroicons-animated/solid and use them in your SolidJS components.",
    },
    {
      question: "Is heroicons-animated free to use?",
      answer: `Yes! ${SITE.NAME} is completely free and open-source under the MIT license. You can use it for personal and commercial projects.`,
    },
    {
      question: "What technologies are used in heroicons-animated?",
      answer: `${SITE.NAME} icons are Solid components written in TypeScript. Animations are powered by Solid MotionOne, and the icons are based on Heroicons.`,
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return (
    <script innerHTML={JSON.stringify(jsonLd)} type="application/ld+json" />
  );
}

export function BreadcrumbJsonLd(props: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: props.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script innerHTML={JSON.stringify(jsonLd)} type="application/ld+json" />
  );
}

export function IconJsonLd(props: { icon: IconManifestItem }) {
  const pascalName = kebabToPascalCase(props.icon.name);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: pascalName,
    description: `Animated ${props.icon.name} icon component for Solid`,
    codeRepository: LINK.GITHUB,
    programmingLanguage: ["TypeScript", "SolidJS"],
    license: LINK.LICENSE,
    isPartOf: {
      "@type": "SoftwareSourceCode",
      name: SITE.NAME,
      url: SITE.URL,
    },
    keywords: props.icon.keywords.join(", "),
  };
  return (
    <script innerHTML={JSON.stringify(jsonLd)} type="application/ld+json" />
  );
}
