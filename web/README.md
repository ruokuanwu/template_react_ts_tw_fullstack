# Web 前端

技术栈：React 18、Vite、TanStack Router（文件路由、自动代码分割）、TanStack Query 5、Better Auth、Eden、Zod、Tailwind CSS 和 shadcn/ui。

## 目录与职责

```text
src/
  routes/          # 文件路由：页面入口、专属 schema、loader/守卫就近定义
    __root.tsx     # 根布局、全局错误与未匹配页面
    index.tsx      # 首页
    login.tsx      # 登录页
    register.tsx   # 注册页；与登录页共享安全 returnTo 校验和已登录守卫
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

需要登录的页面放在 `_authenticated` 目录下；`_authenticated.tsx` 的父级 `beforeLoad` 会先检查会话，下划线布局名不会出现在 URL 中。未登录访问会跳转到登录页，并在 `returnTo` 参数中保留原路径和查询参数；登录、注册页通过 Better Auth SDK 提交，成功确认 Cookie 会话后清理旧账号的 Query 和路由缓存，并替换导航回安全目标地址（默认 `/dashboard`）。

URL 参数 schema 就近放在页面路由文件，通过 `validateSearch` 校验；页面直接使用 `Route.useSearch()` 读取推导后的类型。`Link` / `navigate` 使用独立的 `to` 和 `search` 对象，不手工拼接查询字符串。仪表盘 `view` 缺失或非法时回退到 `summary`；登录页 `returnTo` 仅接受安全站内路径，非法值被忽略。校验默认值不会自动改写地址栏。复杂、复用的业务组件和请求继续放在 `features`，不必全部塞入路由文件。

## 首页落地页

首页 `/` 是参考根目录 `linear.design.md` 实现的原创 Orbit 产品落地页：近黑画布、灰阶面板、细线边框与少量薰衣草蓝强调色。采用系统字体，不加载外部字体、图片或 Linear 的品牌素材。

`src/routes/index.tsx` 定义首页组件，直接编排首屏、产品理念、功能区、工作流程、行动入口和页脚。页面专属模块放在 `src/features/landing/components/`：`landing-header.tsx` 管理移动导航，`product-preview.tsx` 管理产品演示与筛选搜索，`feature-section.tsx` 展示功能卡片，`brand.tsx` 在这些区块间共享品牌标记。配套样式位于 `src/features/landing/landing.css`，限定在 `.orbit-landing` 下；通用 `components/layout` 不承载落地页内容。

根布局对首页、登录和注册跳过原有应用导航、侧栏及提示条；仪表盘保持原有浅色布局。产品演示使用本地模拟数据，支持状态筛选和标题搜索，不调用后端，也不代表真实项目管理功能。

“开始使用”进入已有仪表盘，未登录时由守卫跳转登录，再通过“创建账户”进入注册；两个认证页面互跳保留 `returnTo`。移动导航支持展开、收起和锚点跳转。

## 登录与注册

`features/auth/components/auth-page.tsx` 提供共享认证界面，`auth.css` 使用独立作用域的近黑、灰阶与薰衣草蓝样式，不改变后台主题。`validation.ts` 使用 Zod 校验与中文错误映射，`navigation.ts` 共享安全回跳与已登录重定向逻辑。页面支持密码显隐、自动填充、字段错误、网络错误和防重复提交；未配置的社交登录、邮件重置入口不展示。

注册要求显示名称、邮箱和 8–128 字符密码，确认密码只在前端校验；密码不会被裁剪。当前后端未要求邮箱验证，注册后会自动登录；若以后启用验证，注册成功但无会话时显示检查邮箱提示，不进入受保护页。会话读取失败会显示错误而非冒充未登录。已登录用户访问认证页会跳到安全目标或仪表盘。

`returnTo` 只允许站内路径，拒绝外部 URL、反斜杠、控制字符和直接回到认证页的循环目标。登录/注册成功后会刷新 Better Auth 会话，取消旧查询、清空 Query 与路由缓存，再回到目标页并重新校验路由；不把 token 写入 localStorage。

## 请求与缓存

- API 函数使用 `src/lib/api-client.ts` 的 Eden 客户端；检查 `error` 并抛错，返回业务数据。
- 业务查询配置放在 `features/<name>/queries.ts`，通过 `queryOptions` 声明 key 和 queryFn；请求参数必须包含在 key 中。
- 页面使用 `useQuery`；复杂、复用的逻辑再封装成业务 Hook。写操作使用 `useMutation`，成功后按需 `invalidateQueries`。
- `src/lib/query-client.ts` 是应用唯一的 QueryClient，默认新鲜时间 30 秒、查询重试一次。loader 如需预加载，应复用这个实例。
- 仪表盘通过 `features/hello` 请求已有 `/api/hello`，展示加载、错误、成功与手动刷新。用户模块仍是原来的模拟数据，不假设存在用户列表接口。
- 会话继续由 Better Auth 的 `useSession` 管理，不创建第二份 Query 会话缓存。退出成功后取消查询、清空 Query 与路由缓存、替换导航到登录页并使路由失效。登录、注册及将来的账号切换同样清理旧账号缓存并使路由失效；读取 `returnTo` 时只允许安全站内路径。
- 路由 `beforeLoad` 仅提供前端访问控制，后端仍须独立鉴权；会话请求失败进入错误页，不当作未登录重定向。

## 验证

在仓库根目录执行：

```powershell
bun run build:web
bun run lint:web
bun test --cwd web tests\migration.test.ts tests\auth.test.ts tests\auth-service.test.ts
```

构建先运行 Vite 生成路由树和分包，再运行 TypeScript 类型检查，支持生成文件缺失时的首次构建。直接运行测试前，应确保路由树已通过开发服务或构建更新。

使用现有 Bun 测试运行器，无需额外安装测试框架。回归测试使用内存 history 加载真实路由树，覆盖 URL 参数默认值、未登录重定向、会话错误、退出后重新鉴权、安全返回地址、未匹配页面，以及 Eden 请求和 Query 缓存行为。

部署时，非 API 页面路径需要回退到 SPA 入口。当前后端已经提供页面通配回退；若改为独立静态托管，需在托管服务配置等效规则。
