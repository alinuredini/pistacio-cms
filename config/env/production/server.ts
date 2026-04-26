import type { StrapiEnv } from "../../../types/strapi-env";

/** Strapi Cloud / reverse-proxy: set `PUBLIC_URL` in the project environment. */
export default ({ env }: { env: StrapiEnv }) => {
  const url = env("PUBLIC_URL");
  return url ? { url } : {};
};
