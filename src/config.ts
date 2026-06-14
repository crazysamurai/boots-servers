import type { MigrationConfig } from "drizzle-orm/migrator";

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
};

process.loadEnvFile();

function envOrThrow(key: string) {
  if (process.env[key]) return process.env[key];
  throw new Error(`missing environment variable ${key}`);
}

const dbURL = envOrThrow("DB_URL");
const port = Number(envOrThrow("PORT"));
const platform = envOrThrow("PLATFORM");
const migrationConfig: MigrationConfig = {
  migrationsFolder: "src/db/migrations",
};

const dbConfig: DBConfig = {
  dbURL,
  migrationConfig,
};

const apiConfig: APIConfig = {
  fileServerHits: 0,
  port,
  platform,
};

export const config = {
  apiConfig,
  dbConfig,
};
