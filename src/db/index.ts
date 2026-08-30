import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { config } from "../config";
import * as schema from "./schema";

export const client = new Database(config.databaseUrl.replace("file:", ""));

export const db = drizzle(client, { schema });
