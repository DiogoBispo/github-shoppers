import type { Knex } from "knex";
import { env } from "./src/config/env";

const config: Record<string, Knex.Config> = {
  development: {
    client: "pg",
    connection: env.databaseUrl,
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
    },
  },
  production: {
    client: "pg",
    connection: env.databaseUrl,
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
    },
  },
};

export default config;
