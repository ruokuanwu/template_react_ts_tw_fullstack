---
description: "编写或修改前端代码时使用（client/ 目录）。约定技术栈（React + TypeScript + Vite + shadcn/ui + Tailwind + TanStack Router + Zod）、目录结构、命名与代码风格。"
applyTo: "client/**"
---

# 前端开发约定

## 技术栈

- **框架**：React 18 函数组件 + Hooks，TypeScript（严格模式）
- **构建**：Vite 5，别名 `@` 指向 `client/src`
- **样式**：Tailwind CSS v4（通过 `@tailwindcss/vite` 插件），不使用独立 `tailwind.config`
- **组件库**：shadcn/ui（default 风格、slate 基色、CSS 变量），基础组件放 `components/ui`
- **路由**：TanStack Router 文件路由（`autoCodeSplitting` 开启），路由文件在 `src/routes`
- **校验**：Zod 用于环境变量与外部数据校验

引入新依赖前先确认现有栈是否已能解决；不要引入与上述职责重复的库（如另一套路由、状态或样式方案）。

## 目录结构

```
src/
  components/
    ui/          # shadcn/ui 基础组件（可复用、无业务逻辑）
    layout/      # 布局组件（header、sidebar 等）
  features/<name>/   # 按业务领域组织
    api.ts       # 该领域的数据请求
    types.ts     # 该领域的类型定义
    components/  # 该领域专属组件
    hooks/       # 该领域专属 hooks
  routes/        # TanStack 文件路由页面
  hooks/         # 跨领域通用 hooks
  lib/           # 通用工具（api、utils、constants）
  config/        # 应用配置（集中导出 CONFIG）
  assets/        # 静态资源（icons、images）
```

- 业务代码优先放入对应 `features/<name>/`；仅当逻辑跨多个领域时才放入顶层 `hooks/` 或 `lib/`。
- 通用、无业务耦合的展示组件放 `components/ui`；带业务语义的组件放对应 feature 的 `components/`。

## 命名

- **文件/目录**：kebab-case（如 `user-card.tsx`、`use-auth.ts`、`auth-status.tsx`）
- **组件**：PascalCase 导出（如 `UserCard`）
- **hooks**：`useXxx` 命名，文件用 kebab-case（`use-mobile.ts`）
- **类型**：PascalCase（如 `UserSummary`、`AuthUser`）

## 代码风格

- 不写分号，字符串用单引号（与现有文件保持一致）
- 用 `@/` 绝对导入，不用深层相对路径（如 `../../../lib`）
- 合并 className 一律用 `cn()`（来自 `@/lib/utils`），不要手动拼接字符串
- 组件变体用 `class-variance-authority`（cva）定义，参考 `components/ui/button.tsx`
- 需要转发 ref 的组件用 `React.forwardRef` 并设置 `displayName`
- 图标统一用 `lucide-react`
- 注释使用中文，与现有代码一致

## 配置与环境变量

- 运行时配置只从 `@/config` 的 `CONFIG` 读取，不要在业务代码里直接读 `import.meta.env`
- 新增环境变量须加 `VITE_` 前缀，并在 `config/index.ts` 的 Zod schema 中登记与提供默认值

## 数据请求

- 统一走 `@/lib/api` 的封装（`apiGet` 等）；相对路径 `/api/...` 经 Vite 代理转发到后端
- 领域相关的请求函数放在 `features/<name>/api.ts`，返回类型引用该领域 `types.ts`

## 路由

- 页面即文件：在 `src/routes` 下创建，用 `createFileRoute` 导出 `Route`
- 不要手改 `routeTree.gen.ts`（自动生成）
- 页面间跳转用 `@tanstack/react-router` 的 `Link`
