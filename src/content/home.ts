/**
 * Default marketing-site copy used by `scripts/seed.ts` when seeding Strapi.
 * Replace or extend with your real content; keep `homeContentByLocale` in sync with the seed script.
 */

type IconKey = "puzzle" | "desktop" | "masked-hero" | "money-stack" | "blush";
type IconBg = "mint" | "soft" | "cool" | "rose" | "white";

interface HomeSectionSeed {
  slug: string;
  eyebrow: string;
  iconKey: IconKey;
  iconBg: IconBg;
  title: string;
  body: string;
  screenshotId: string;
  columns?: { title: string; body: string }[];
}

interface PricingTierSeed {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  featured?: boolean;
  cta: { label: string; href: string };
  includes: string[];
}

interface BlogPostSeed {
  slug: string;
  title: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  excerpt: string;
}

interface FooterColumnSeed {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

interface LocaleHome {
  hero: { title: string; quote: string };
  cta: { title: string; ctaLabel: string; ctaHref: string };
  sections: HomeSectionSeed[];
  pricing: { tiers: PricingTierSeed[] };
  blog: { posts: BlogPostSeed[] };
  footer: {
    columns: FooterColumnSeed[];
    builtWith: string;
    location: string;
  };
}

const en: LocaleHome = {
  hero: {
    title: "Run your studio without the spreadsheet chaos",
    quote: "Pistacio keeps time, projects, and clients in one calm place — so your team ships work, not status updates.",
  },
  cta: {
    title: "Ready to see Pistacio on your own data?",
    ctaLabel: "Join the waitlist",
    ctaHref: "/waitlist",
  },
  sections: [
    {
      slug: "one-place-for-operations",
      eyebrow: "Operations",
      iconKey: "puzzle",
      iconBg: "mint",
      title: "One workspace for delivery and finance",
      body: "Track time, plan work, and stay close to revenue without jumping between tools.",
      screenshotId: "01-dashboard-overview",
      columns: [
        {
          title: "Fewer handoffs",
          body: "Give everyone the same picture of clients, projects, and capacity.",
        },
      ],
    },
  ],
  pricing: {
    tiers: [
      {
        slug: "core",
        name: "Core",
        tagline: "Small teams getting organized",
        price: "€19",
        period: "per user / month",
        featured: false,
        cta: { label: "Start trial", href: "/waitlist" },
        includes: ["Time tracking", "Tasks", "Basic reports"],
      },
    ],
  },
  blog: {
    posts: [
      {
        slug: "why-we-built-pistacio",
        title: "Why we built Pistacio",
        category: "Product",
        readMinutes: 4,
        publishedAt: "Apr 2026",
        excerpt: "A short note on what we are optimizing for — calm operations, not feature noise.",
      },
    ],
  },
  footer: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Pricing", href: "/pricing" },
          { label: "Waitlist", href: "/waitlist" },
        ],
      },
    ],
    builtWith: "Built with care in Europe",
    location: "Berlin · Remote",
  },
};

const de: LocaleHome = {
  hero: {
    title: "Führen Sie Ihr Studio ohne Tabellen-Chaos",
    quote: "Pistacio bündelt Zeit, Projekte und Kund:innen — damit Ihr Team liefert, statt Status zu jonglieren.",
  },
  cta: {
    title: "Pistacio mit Ihren echten Daten erleben?",
    ctaLabel: "Zur Warteliste",
    ctaHref: "/waitlist",
  },
  sections: [
    {
      slug: "eine-zentrale-fuer-ablauf",
      eyebrow: "Operations",
      iconKey: "puzzle",
      iconBg: "mint",
      title: "Ein Arbeitsraum für Delivery und Zahlen",
      body: "Zeiten erfassen, Arbeit planen und Umsatz im Blick behalten — ohne Tool-Hopping.",
      screenshotId: "01-dashboard-overview",
      columns: [
        {
          title: "Weniger Übergaben",
          body: "Alle sehen Kund:innen, Projekte und Kapazität gleichermaßen.",
        },
      ],
    },
  ],
  pricing: {
    tiers: [
      {
        slug: "core",
        name: "Core",
        tagline: "Kleine Teams, die Struktur brauchen",
        price: "19 €",
        period: "pro Nutzer:in / Monat",
        featured: false,
        cta: { label: "Test starten", href: "/waitlist" },
        includes: ["Zeiterfassung", "Aufgaben", "Basis-Reports"],
      },
    ],
  },
  blog: {
    posts: [
      {
        slug: "warum-wir-pistacio-bauen",
        title: "Warum wir Pistacio bauen",
        category: "Produkt",
        readMinutes: 4,
        publishedAt: "Apr. 2026",
        excerpt: "Kurz erklärt: Wir optimieren für ruhige Abläufe — nicht für Feature-Lärm.",
      },
    ],
  },
  footer: {
    columns: [
      {
        title: "Produkt",
        links: [
          { label: "Preise", href: "/pricing" },
          { label: "Warteliste", href: "/waitlist" },
        ],
      },
    ],
    builtWith: "Mit Sorgfalt in Europa gebaut",
    location: "Berlin · Remote",
  },
};

export const homeContentByLocale = { en, de } as const;
