export const config = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || window.location.origin,
  debug: import.meta.env.DEBUG,
} as const;
