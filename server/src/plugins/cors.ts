import { cors } from "@elysiajs/cors";
import { CONFIG } from "../config/config";

export const corsPlugin = cors({
  origin: CONFIG.clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
