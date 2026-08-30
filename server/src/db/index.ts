import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { CONFIG } from "../config/config";
import * as schema from "./schema";

export const client = new Database(CONFIG.databaseUrl.replace("file:", ""));

export const db = drizzle(client, { schema });
