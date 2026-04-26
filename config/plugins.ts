import type { StrapiEnv } from "../types/strapi-env";

export default ({ env }: { env: StrapiEnv }) => ({
  i18n: {
    enabled: true,
    config: {
      defaultLocale: env("CMS_DEFAULT_LOCALE", "en"),
      locales: env.array("CMS_LOCALES", ["en", "de"]),
    },
  },
});
