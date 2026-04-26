/**
 * Seed Strapi from the Astro fallback content under `../src/content/*`.
 *
 * Usage: from project root
 *   npm run cms:seed
 *
 * Notes:
 * - Idempotent: existing entries with the same `slug` are updated, not duplicated.
 * - Locales: writes both `en` (default) and `de` localizations.
 * - Requires Strapi to have been built once (so generated types exist).
 */

import { compileStrapi, createStrapi } from "@strapi/strapi";

type Locale = "en" | "de";

interface Loaders {
  hero: Record<Locale, { title: string; quote: string }>;
  cta: Record<Locale, { title: string; ctaLabel: string; ctaHref: string }>;
  sections: Record<Locale, any[]>;
  pricing: Record<Locale, any[]>;
  blog: Record<Locale, any[]>;
  footer: Record<Locale, any>;
}

async function loadFallbacks(): Promise<Loaders> {
  // Lazy-resolve TS source via tsx loader. Path is relative to this file.
  const home = await import("../../src/content/home");
  const data = home.homeContentByLocale;
  return {
    hero: { en: data.en.hero, de: data.de.hero },
    cta: { en: data.en.cta, de: data.de.cta },
    sections: { en: data.en.sections, de: data.de.sections },
    pricing: { en: data.en.pricing.tiers, de: data.de.pricing.tiers },
    blog: { en: data.en.blog.posts, de: data.de.blog.posts },
    footer: { en: data.en.footer, de: data.de.footer },
  };
}

async function upsertSingle(strapi: any, uid: string, locale: Locale, data: Record<string, unknown>) {
  const existing = await strapi.documents(uid).findFirst({ locale });
  if (existing) {
    await strapi.documents(uid).update({
      documentId: existing.documentId,
      locale,
      data,
    });
  } else {
    await strapi.documents(uid).create({ locale, data });
  }
}

async function upsertBySlug(
  strapi: any,
  uid: string,
  locale: Locale,
  slug: string,
  data: Record<string, unknown>,
) {
  const existing = await strapi.documents(uid).findFirst({
    locale,
    filters: { slug: { $eq: slug } },
  });
  if (existing) {
    await strapi.documents(uid).update({
      documentId: existing.documentId,
      locale,
      data,
    });
  } else {
    await strapi.documents(uid).create({ locale, data });
  }
}

async function run() {
  const ctx = await compileStrapi();
  const strapi = await createStrapi(ctx).load();

  const fallbacks = await loadFallbacks();
  const locales: Locale[] = ["en", "de"];

  for (const locale of locales) {
    await upsertSingle(strapi, "api::home-hero.home-hero", locale, fallbacks.hero[locale]);

    await upsertSingle(strapi, "api::cta-section.cta-section", locale, {
      title: fallbacks.cta[locale].title,
      cta: { label: fallbacks.cta[locale].ctaLabel, href: fallbacks.cta[locale].ctaHref },
    });

    for (const [order, section] of fallbacks.sections[locale].entries()) {
      await upsertBySlug(strapi, "api::home-section.home-section", locale, section.slug, {
        slug: section.slug,
        order,
        eyebrow: section.eyebrow,
        iconKey: section.iconKey,
        iconBg: section.iconBg,
        title: section.title,
        body: section.body,
        screenshotKey: section.screenshotId,
        columns: section.columns ?? [],
      });
    }

    for (const [order, tier] of fallbacks.pricing[locale].entries()) {
      await upsertBySlug(strapi, "api::pricing-tier.pricing-tier", locale, tier.slug, {
        slug: tier.slug,
        order,
        name: tier.name,
        tagline: tier.tagline,
        price: tier.price,
        period: tier.period,
        featured: Boolean(tier.featured),
        cta: { label: tier.cta.label, href: tier.cta.href },
        includes: tier.includes,
      });
    }

    for (const post of fallbacks.blog[locale]) {
      await upsertBySlug(strapi, "api::blog-post.blog-post", locale, post.slug, {
        slug: post.slug,
        title: post.title,
        category: post.category,
        readMinutes: post.readMinutes,
        publishedAtLabel: post.publishedAt,
        excerpt: post.excerpt,
      });
    }

    await upsertSingle(strapi, "api::footer-nav.footer-nav", locale, {
      columns: fallbacks.footer[locale].columns.map((column: any) => ({
        title: column.title,
        links: column.links,
      })),
      builtWith: fallbacks.footer[locale].builtWith,
      location: fallbacks.footer[locale].location,
    });
  }

  await strapi.destroy();
  // eslint-disable-next-line no-console
  console.log("✔ Strapi seeded for locales:", locales.join(", "));
  process.exit(0);
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("✖ Seed failed:", error);
  process.exit(1);
});
