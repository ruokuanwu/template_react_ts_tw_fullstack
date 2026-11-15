# Web 前端

技术栈：React 18、Vite、TanStack Router（文件路由、自动代码分割）、TanStack Query 5、Better Auth、Eden、Zod、Tailwind CSS 和 shadcn/ui。

## 目录与职责

```text
src/
  routes/          # 文件路由：页面入口、专属 schema、loader/守卫就近定义
    __root.tsx     # 根布局、全局错误与未匹配页面
    index.tsx      # 首页
    login.tsx      # 登录页与 returnTo schema
    _authenticated.tsx             # 无路径鉴权布局
    _authenticated/dashboard.tsx   # 仪表盘与 view schema
  main.tsx         # 创建 Router、注册路由类型、挂载 Provider
  routeTree.gen.ts # 自动生成的路由树，不手动修改
  features/        # 按业务组织 api、queries、types、hooks、components
  components/      # 通用 UI 与布局部件
  hooks/           # 通用 Hook
  lib/             # Eden、共享 QueryClient、工具与常量
  config/          # 运行时配置
```

采用与 TanStack Router `basic-file-based` 示例一致的组织方式：在 `src/routes` 新建路由文件，用 `createFileRoute` 导出 `Route`，同文件声明页面组件及专属 schema。Vite Router 插件会自动生成 `src/routeTree.gen.ts`，并通过 `autoCodeSplitting` 按需加载页面；无需手工注册路由。应用直接在 `src/main.tsx` 创建 Router 并挂载 `RouterProvider`；测试从生成树创建独立的内存 Router，不导入会挂载 DOM 的启动文件。生成文件纳入版本控制，不手动编辑；新增或移动路由后运行开发服务或构建以重新生成。

需要登录的页面放在 `_authenticated` 目录下；`_authenticated.tsx` 的父级 `beforeLoad` 会先检查会话，下划线布局名不会出现在 URL 中。未登录访问会跳转到登录页，并在 `returnTo` 参数中保留原路径和查询参数；登录页目前仍为占位页，尚未实现提交及登录后返回。

URL 参数 schema 就近放在页面路由文件，通过 `validateSearch` 校验；页面直接使用 `Route.useSearch()` 读取推导后的类型。`Link` / `navigate` 使用独立的 `to` 和 `search` 对象，不手工拼接查询字符串。仪表盘 `view` 缺失或非法时回退到 `summary`；登录页 `returnTo` 仅接受安全站内路径，非法值被忽略。校验默认值不会自动改写地址栏。复杂、复用的业务组件和请求继续放在 `features`，不必全部塞入路由文件。

## 请求与缓存

- API 函数使用 `src/lib/api-client.ts` 的 Eden 客户端；检查 `error` 并抛错，返回业务数据。
- 业务查询配置放在 `features/<name>/queries.ts`，通过 `queryOptions` 声明 key 和 queryFn；请求参数必须包含在 key 中。
- 页面使用 `useQuery`；复杂、复用的逻辑再封装成业务 Hook。写操作使用 `useMutation`，成功后按需 `invalidateQueries`。
- `src/lib/query-client.ts` 是应用唯一的 QueryClient，默认新鲜时间 30 秒、查询重试一次。loader 如需预加载，应复用这个实例。
- 仪表盘通过 `features/hello` 请求已有 `/api/hello`，展示加载、错误、成功与手动刷新。用户模块仍是原来的模拟数据，不假设存在用户列表接口。
- 会话继续由 Better Auth 的 `useSession` 管理，不创建第二份 Query 会话缓存。退出成功后取消查询、清空 Query 与路由缓存、替换导航到登录页并使路由失效。将来实现登录或账号切换时，也必须清理旧账号缓存并使路由失效；读取 `returnTo` 时只允许安全站内路径。
- 路由 `beforeLoad` 仅提供前端访问控制，后端仍须独立鉴权；会话请求失败进入错误页，不当作未登录重定向。

## 验证

在仓库根目录执行：

```powershell
bun run build:web
bun run lint:web
bun test --cwd web tests\migration.test.ts
```

构建先运行 Vite 生成路由树和分包，再运行 TypeScript 类型检查，支持生成文件缺失时的首次构建。直接运行测试前，应确保路由树已通过开发服务或构建更新。

使用现有 Bun 测试运行器，无需额外安装测试框架。回归测试使用内存 history 加载真实路由树，覆盖 URL 参数默认值、未登录重定向、会话错误、退出后重新鉴权、安全返回地址、未匹配页面，以及 Eden 请求和 Query 缓存行为。

部署时，非 API 页面路径需要回退到 SPA 入口。当前后端已经提供页面通配回退；若改为独立静态托管，需在托管服务配置等效规则。
