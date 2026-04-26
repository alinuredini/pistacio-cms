/**
 * Strapi config factory `env` helper (subset used by this project’s config files).
 * @see https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html
 */
export type StrapiEnv = {
  (name: string): string | undefined;
  (name: string, defaultValue: string): string;
  (name: string, defaultValue: string | undefined): string | undefined;
  int(name: string, defaultValue?: number): number;
  bool(name: string, defaultValue?: boolean): boolean;
  array(name: string, defaultValue?: string[]): string[];
};
