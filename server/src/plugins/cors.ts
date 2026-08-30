import { cors } from "@elysiajs/cors";
import { config } from "../config";

export const corsPlugin = cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
