import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";

//connecting to postgres and setting up drizzle on the schema
const connection = postgres(config.dbConfig.dbURL);
export const db = drizzle(connection, { schema });
