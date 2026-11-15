export const APP_NAME = "test";

export const NAVIGATION_ITEMS = [
  { id: "index", path: "/", label: "首页", file: "src/routes/index.tsx" },
  {
    id: "dashboard",
    path: "/dashboard",
    label: "仪表盘",
    file: "src/routes/_authenticated/dashboard.tsx",
  },
  { id: "login", path: "/login", label: "登录", file: "src/routes/login.tsx" },
] as const;
