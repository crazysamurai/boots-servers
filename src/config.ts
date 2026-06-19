import type { MigrationConfig } from "drizzle-orm/migrator";

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
  polkaKey: string;
};

type TokenConfig = {
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
  jwtSecret: string;
};

process.loadEnvFile();

function envOrThrow(key: string) {
  if (process.env[key]) return process.env[key];
  throw new Error(`missing environment variable ${key}`);
}

const dbURL = envOrThrow("DB_URL");
const port = Number(envOrThrow("PORT"));
const platform = envOrThrow("PLATFORM");
const jwtSecret = envOrThrow("JWT_SECRET");
const accessTokenExpiration = envOrThrow("ACCESS_TOKEN_EXPIRATION");
const refreshTokenExpiration = envOrThrow("REFRESH_TOKEN_EXPIRATION");
const polkaKey = envOrThrow("POLKA_KEY");

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
  polkaKey,
};

const tokenConfig: TokenConfig = {
  accessTokenExpiration: Number(accessTokenExpiration),
  refreshTokenExpiration: Number(refreshTokenExpiration),
  jwtSecret,
};

export const config = {
  apiConfig,
  dbConfig,
  tokenConfig,
};
