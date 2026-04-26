import path from "node:path";

import type { StrapiEnv } from "../types/strapi-env";

type MergeOptions = {
  defaultConfig?: Record<string, unknown>;
  overrideConfig?: Record<string, unknown>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(
  base: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
): Record<string, unknown> {
  return sources.reduce<Record<string, unknown>>((acc, src) => {
    for (const [key, val] of Object.entries(src)) {
      const existing = acc[key];
      if (isPlainObject(existing) && isPlainObject(val)) {
        acc[key] = deepMerge({ ...existing }, val);
      } else {
        acc[key] = val;
      }
    }
    return acc;
  }, { ...base });
}

export default ({ filepath }: { filepath: string }) => {
  return (
    { env }: { env: StrapiEnv },
    { defaultConfig = {}, overrideConfig = {} }: MergeOptions = {},
  ) => {
    const abs = path.isAbsolute(filepath) ? filepath : path.resolve(filepath);
    let loaded: unknown;
    try {
      // Strapi Cloud resolves compiled config paths; CJS require matches runtime.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      loaded = require(abs);
    } catch {
      loaded = {};
    }
    const resolved =
      typeof loaded === "function" ? (loaded as (ctx: { env: StrapiEnv }) => unknown)({ env }) : loaded;
    const user = isPlainObject(resolved) ? resolved : {};
    return deepMerge(
      {},
      defaultConfig,
      user,
      overrideConfig,
    );
  };
};
