export const config = {
  name: import.meta.env.VITE_APP_NAME || "Vite React shadcn Template",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || window.location.origin,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
