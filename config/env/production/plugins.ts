import type { StrapiEnv } from "../../../types/strapi-env";

/** Production-only plugin overrides (e.g. S3 upload). Base config stays in `config/plugins.ts`. */
export default (_params: { env: StrapiEnv }) => ({});
