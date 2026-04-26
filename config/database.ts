import path from "node:path";

import type { StrapiEnv } from "../types/strapi-env";

const parseDatabaseUrl = (url: string) => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 5432),
    database: parsed.pathname.replace(/^\//, ""),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    ssl: parsed.searchParams.get("ssl") === "true" || parsed.searchParams.get("sslmode") === "require",
  };
};

export default ({ env }: { env: StrapiEnv }) => {
  const client = env("DATABASE_CLIENT", env("NODE_ENV") === "production" ? "postgres" : "sqlite");

  const connections = {
    sqlite: {
      connection: {
        filename: path.join(__dirname, "..", env("DATABASE_FILENAME", "data.db")),
      },
      useNullAsDefault: true,
    },
    postgres: (() => {
      const url = env("DATABASE_URL");
      const fromUrl = url ? parseDatabaseUrl(url) : null;
      return {
        connection: fromUrl ?? {
          host: env("DATABASE_HOST", "localhost"),
          port: env.int("DATABASE_PORT", 5432),
          database: env("DATABASE_NAME", "pistacio_cms"),
          user: env("DATABASE_USERNAME", "pistacio"),
          password: env("DATABASE_PASSWORD", "pistacio"),
          ssl:
            env.bool("DATABASE_SSL", false) && {
              key: env("DATABASE_SSL_KEY", undefined),
              cert: env("DATABASE_SSL_CERT", undefined),
              ca: env("DATABASE_SSL_CA", undefined),
              capath: env("DATABASE_SSL_CAPATH", undefined),
              cipher: env("DATABASE_SSL_CIPHER", undefined),
              rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", true),
            },
          schema: env("DATABASE_SCHEMA", "public"),
        },
        pool: {
          min: env.int("DATABASE_POOL_MIN", 2),
          max: env.int("DATABASE_POOL_MAX", 10),
        },
      };
    })(),
  } as const;

  return {
    connection: {
      client,
      ...connections[client as keyof typeof connections],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};
