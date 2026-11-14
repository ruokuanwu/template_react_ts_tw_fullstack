# Web 前端

技术栈：React 18、Vite、React Router 7（Data Mode）、TanStack Query 5、Better Auth、Eden、Zod、Tailwind CSS 和 shadcn/ui。

## 目录与职责

```text
src/
  router/          # 显式路由树、loader
  pages/           # 页面入口及页面专属 URL 参数校验；通过路由 lazy 按需加载
  layouts/         # 带 Outlet 的页面布局
  features/        # 按业务组织 api、queries、types、hooks、components
  components/      # 通用 UI 与布局部件
  hooks/           # 通用 Hook
  lib/             # Eden、共享 QueryClient、工具与常量
  config/          # 运行时配置
```

新增页面时，在 `src/pages` 创建组件，并在 `src/router/index.tsx` 注册；不再使用文件路由插件或生成路由树。需要登录的页面放在 `requireSession` 对应的子路由中。未登录访问会跳转到登录页，并在 `returnTo` 参数中保留原路径；登录页目前仍为占位页，尚未实现提交及登录后返回。

## 请求与缓存

- API 函数使用 `src/lib/api-client.ts` 的 Eden 客户端；检查 `error` 并抛错，返回业务数据。
- 业务查询配置放在 `features/<name>/queries.ts`，通过 `queryOptions` 声明 key 和 queryFn；请求参数必须包含在 key 中。
- 页面使用 `useQuery`；复杂、复用的逻辑再封装成业务 Hook。写操作使用 `useMutation`，成功后按需 `invalidateQueries`。
- `src/lib/query-client.ts` 是应用唯一的 QueryClient，默认新鲜时间 30 秒、查询重试一次。loader 如需预加载，应复用这个实例。
- 仪表盘通过 `features/hello` 请求已有 `/api/hello`，展示加载、错误、成功与手动刷新。用户模块仍是原来的模拟数据，不假设存在用户列表接口。
- 会话继续由 Better Auth 的 `useSession` 管理，不再创建第二份 Query 会话缓存。退出成功后取消查询并清空缓存。将来实现登录或账号切换时，也必须取消并清空旧账号缓存；读取 `returnTo` 时只允许安全站内路径。
- 路由 loader 仅提供前端访问控制，后端仍须独立鉴权。

## 验证

在仓库根目录执行：

```powershell
bun run build:web
bun run lint:web
bun test --cwd web tests\migration.test.ts
```

使用现有 Bun 测试运行器，无需额外安装测试框架。回归测试覆盖 URL 参数默认值、未登录重定向、会话错误，以及 Eden 请求和 Query 缓存行为。

部署时，非 API 页面路径需要回退到 SPA 入口。当前后端已经提供页面通配回退；若改为独立静态托管，需在托管服务配置等效规则。
