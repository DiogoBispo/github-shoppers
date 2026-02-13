import { Pool } from "pg";
import { env } from "../config/env";
import { logger } from "../infra/logger";

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

pool.on("error", (e) => {
  logger.error("Postgres pool error", { message: e.message });
});
