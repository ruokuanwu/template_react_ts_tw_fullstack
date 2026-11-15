# 前端开发约定

本文件适用于 `web/` 及其子目录。前端实际位于 `web/`，不要另建 `client/` 或平行的前端工程。修改前先阅读目标文件及相邻实现，优先遵循现有结构与风格。

## 目录结构（重点）

以下为现有结构；`components/ui/` 等未出现的目录仅在确有需要时创建。

```text
web/
  public/                         # 原样提供的静态文件，不经过源码导入处理
  src/
    assets/
      icons/                      # 通过源码导入的图标资源
      images/                     # 通过源码导入的图片资源
    components/
      layout/
        site-layout.tsx           # 公共站点页头、页脚
        dashboard-layout.tsx      # Dashboard 布局
    config/
      index.ts                    # 浏览器端配置统一入口
    features/                     # 按业务领域组织实现
      auth/
        auth-client.ts            # Better Auth 客户端
        components/
          auth-form.tsx
          account-menu.tsx
      landing/
        demo-data.ts
        components/
          product-preview.tsx
      settings/
        theme-context.ts          # 主题上下文及相关逻辑
    lib/
      api-client.ts               # Eden 类型安全 API 客户端
      utils.ts                    # 跨业务通用工具
    routes/                       # TanStack Router 文件路由
      __root.tsx                  # 根路由、全局布局选择与 404
      index.tsx                   # /
      demo.tsx                    # /demo
      login.tsx                   # /login
      register.tsx                # /register
      dashboard.tsx               # /dashboard 父路由、登录校验
      dashboard.index.tsx         # /dashboard 索引页
      dashboard.settings.tsx      # /dashboard/settings
    index.css                     # Tailwind 入口、主题变量、共享样式
    main.tsx                      # React、QueryClient、Router 初始化
    routeTree.gen.ts              # Router 插件生成，不手工修改
    vite-env.d.ts                 # Vite 环境类型
  components.json                 # shadcn/ui 配置
  eslint.config.js
  index.html
  package.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
```

### 新代码放在哪里

| 内容 | 放置位置 | 边界 |
| --- | --- | --- |
| 页面入口、路由参数、路由守卫 | `src/routes/` | 遵循文件路由命名，不另建 `pages/` 或手写第二套路由表 |
| 业务组件、业务状态、业务数据逻辑 | `src/features/<业务域>/` | 优先扩展现有 `auth`、`landing`、`settings`；业务组件放对应 `components/` |
| 跨页面布局 | `src/components/layout/` | 只负责布局及共享导航，业务逻辑留在 feature |
| 跨业务共享组件 | `src/components/` | 仅在确实通用时提升，避免提前抽象 |
| shadcn/ui 基础组件 | `src/components/ui/`（按需新增） | 保持基础展示能力，不耦合具体业务 |
| 跨业务通用工具、基础客户端 | `src/lib/` | 不把业务模块堆到通用工具目录 |
| 浏览器配置 | `src/config/index.ts` | 集中读取，不在业务组件散落环境变量访问 |
| 构建处理的图片、图标 | `src/assets/images/`、`src/assets/icons/` | 使用源码导入 |
| 需保留文件名、按固定 URL 获取的资源 | `public/` | 使用公开路径，不从源码导入 |
| 全局主题、共享样式 | `src/index.css` | 页面局部样式优先使用 Tailwind 类名 |

- 业务专属 hook、类型和工具就近放在所属 feature；规模需要时再建立局部 `hooks/`、`types/` 等目录，不预建空目录。
- 路由文件负责页面组合与路由行为；复杂业务实现下沉到 feature，不持续堆积在路由文件中。
- `@/` 指向 `web/src/`。跨目录引用优先使用该别名，同目录引用可使用相对路径。
- `.tanstack/`、`node_modules/` 和根目录 `dist/web/` 分别属于工具缓存、依赖与构建输出，不放业务源码，不手工修改生成内容。

## 技术栈与代码风格

- React 18、TypeScript 严格模式、Vite、Tailwind CSS v4、TanStack Router、TanStack Query；已有 shadcn/ui 配置、Lucide 图标、Zod、Better Auth 和 Eden 客户端。
- 使用函数组件与 Hooks。普通文件名沿用 `kebab-case`，组件名使用 `PascalCase`，变量和函数使用 `camelCase`；路由文件遵循 Router 特殊命名。
- 保持目标文件原有格式，不为局部修改重排整个文件；避免 `any`、无依据的类型断言及未使用的导入。
- 复用 `src/lib/utils.ts` 中的工具及现有布局、样式。Tailwind v4 使用 `src/index.css` 的 `@import`、`@theme` 配置，不擅自引入 v3 配置体系。
- 保持现有页面语言与交互风格；补齐表单标签、键盘操作、焦点样式及必要的加载、空态、错误态，不静默吞错。

## 路由、数据与认证

- 新页面使用 `createFileRoute`；嵌套路由沿用 `dashboard.tsx`、`dashboard.index.tsx`、`dashboard.settings.tsx` 的平铺点号命名模式。
- `src/routeTree.gen.ts` 由 Vite Router 插件在开发或构建时生成；新增路由后通过正常命令更新，不手改。
- `main.tsx` 已初始化共享 QueryClient 并注入路由上下文；服务端数据优先复用 TanStack Query，不重复创建全局客户端。
- 普通 API 优先使用 `src/lib/api-client.ts` 的 `apiClient`。其后端 `App` 引用必须保持为类型导入，不能把后端运行时代码引入浏览器。
- 认证统一使用 `src/features/auth/auth-client.ts` 的 `authClient`；保留其对后端响应封装的适配，不在页面重复实现。
- 受保护页面沿用 `dashboard.tsx` 的 `beforeLoad` 校验模式，区分未登录跳转与请求失败；前端守卫不能替代后端权限校验。

## 环境与部署边界

- Vite 从仓库根目录读取环境文件；API 地址通过 `src/config/index.ts` 的 `VITE_API_BASE_URL` 配置，默认使用当前页面 origin。
- 本地 Vite 将 `/api` 代理到 `http://localhost:3000`；不要在业务组件硬编码后端地址。
- 浏览器可见环境变量不能包含数据库凭据、认证密钥等秘密；服务端环境变量不等于前端配置。
- 前端构建输出到仓库根目录 `dist/web/`，不是 `web/dist/`。现有 `deploy/dev/docker-compose.yml` 运行生产模式的整合应用并映射 `3000:3000`，不是 Vite 热更新服务。

## 常用命令与验证

在仓库根目录使用 Bun workspace 命令：

```powershell
bun run dev:web    # 仅前端开发服务
bun run dev        # 同时启动前后端开发服务
bun run lint:web   # 前端 ESLint，零警告
bun run build:web  # Vite 构建及 TypeScript 检查
```

- 代码变更后运行相关检查；前端常规变更至少执行 `bun run lint:web` 和 `bun run build:web`。
- 涉及页面交互或布局时，再用浏览器验证实际路由、交互、响应式与错误态，不以构建成功代替行为验证。
- 当前前端未配置测试脚本；不要声称已通过不存在的测试。仅文档变更核对内容、路径与命令即可，无需运行构建。
