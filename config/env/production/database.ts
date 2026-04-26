import path from "node:path";

import type { StrapiEnv } from "../../../types/strapi-env";

const sslBlock = (env: StrapiEnv) =>
  env.bool("DATABASE_SSL", false) && {
    key: env("DATABASE_SSL_KEY", undefined),
    cert: env("DATABASE_SSL_CERT", undefined),
    ca: env("DATABASE_SSL_CA", undefined),
    capath: env("DATABASE_SSL_CAPATH", undefined),
    cipher: env("DATABASE_SSL_CIPHER", undefined),
    rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", true),
  };

/**
 * Production database preset (multi-client), aligned with Strapi Cloud / Knex expectations.
 * Merges with root `config/database.ts` via Strapi’s env-specific config loading.
 */
export default ({ env }: { env: StrapiEnv }) => {
  const connections = {
    mysql: {
      connection: {
        connectionString: env("DATABASE_URL", undefined),
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 3306),
        database: env("DATABASE_NAME", "strapi"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        ssl: sslBlock(env),
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
    postgres: {
      connection: {
        connectionString: env("DATABASE_URL", undefined),
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "strapi"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        ssl: sslBlock(env),
        schema: env("DATABASE_SCHEMA", "public"),
        query_timeout: env.int("DATABASE_QUERY_TIMEOUT", 60_000),
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          "..",
          "..",
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db"),
        ),
      },
      useNullAsDefault: true,
    },
  } as const;

  const client = env("DATABASE_CLIENT", "sqlite") as keyof typeof connections;

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60_000),
    },
  };
};
