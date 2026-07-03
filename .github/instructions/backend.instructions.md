---
description: "编写或修改后端代码时使用（server/ 目录）。约定技术栈（Bun + Elysia + Drizzle ORM + SQLite + Pino + Zod/TypeBox）、模块化目录结构、命名与代码风格、路由/服务/仓储分层、插件与环境变量约定。"
applyTo: "server/**"
---

# 后端开发约定

## 技术栈

- **运行时**：Bun（用 `Bun.env` 读环境变量，用 `bun:sqlite` 等内置能力，不引入 Node 专属依赖的等价替代）
- **框架**：Elysia（TypeScript，ESM `type: module`）
- **ORM / 数据库**：Drizzle ORM + SQLite（`drizzle-orm/bun-sqlite`），迁移用 `drizzle-kit`
- **日志**：Pino（统一从 `lib/logger` 导入 `logger`）
- **校验**：Elysia 内置 TypeBox（`t`）校验路由输入；schema 定义在各模块的 `*.schema.ts`

引入新依赖前先确认现有栈是否已能解决；不要引入职责重复的库（如另一套 web 框架、ORM、日志或校验方案）。优先使用 Bun / Elysia / Drizzle 的内置能力。

## 目录结构

```
src/
  index.ts            # 入口：创建并启动 app，监听端口
  app.ts              # 组装 Elysia 实例（挂载插件、分组路由）
  config/
    config.ts         # 集中读取环境变量，导出 CONFIG 对象
  db/
    index.ts          # 初始化 drizzle 实例，导出 db
    schema.ts         # Drizzle 表定义
    migrate.ts        # 迁移执行脚本
  lib/                # 通用工具（logger 等，无业务耦合）
  plugins/            # Elysia 插件（cors、db、logger 等横切能力）
  modules/<name>/     # 按业务领域组织
    <name>.routes.ts      # 路由（HTTP 层，仅编排，不写业务逻辑）
    <name>.service.ts     # 业务逻辑
    <name>.repository.ts  # 数据访问（只与 db 交互）
    <name>.schema.ts      # 该模块的输入校验 schema
  cli/                # 命令行入口与子命令
  cron/               # 定时任务入口与 jobs
```

- 新业务放入 `modules/<name>/`，遵循 `routes → service → repository` 分层。
- 横切能力（跨模块、与请求生命周期相关）做成 `plugins/` 下的 Elysia 插件。
- 无业务耦合的纯工具放 `lib/`；数据库相关放 `db/`。

## 分层职责

- **routes**：定义 HTTP 端点，解析入参、调用 service、组装响应、设置状态码。不直接访问 db。
- **service**：编排业务逻辑，调用 repository。不感知 HTTP（不读 `set`、`params` 等）。
- **repository**：唯一直接使用 `db` 与 `schema` 的地方，返回领域数据。
- 三层各导出一个同名对象（如 `usersService`、`usersRepository`），方法用箭头函数。

## 路由约定

- 每个模块导出一个 `new Elysia()` 实例（如 `usersRoute`），在 `app.ts` 里通过 `.group('/api', ...)` 挂载。
- 路由输入用第三参数的 `{ params, body, query }` 传入对应 schema 做校验，schema 从 `*.schema.ts` 导入。
- 统一响应结构：成功 `{ success: true, data, ... }`，失败 `{ success: false, message }` 并用 `set.status` 设置状态码（如 404）。

```ts
.get(
    '/users/:id',
    ({ params: { id }, set }) => {
        const user = usersService.get(id)
        if (!user) {
            set.status = 404
            return { success: false, message: 'User not found' }
        }
        return { success: true, data: user }
    },
    { params: userIdParamsSchema },
)
```

## 数据库与迁移

- 表定义集中在 `db/schema.ts`，用 Drizzle 的 `sqliteTable` 等 helper。
- 改 schema 后用 `bun run db:generate` 生成迁移，用 `bun run db:migrate` 执行；不要手改 `migrations/` 生成物。
- repository 用 `$inferInsert` / `$inferSelect` 推导类型，避免手写重复类型。

## 插件

- 插件放 `plugins/`，导出 `new Elysia({ name: '<name>' })` 实例，`name` 用于去重。
- 需要注入依赖用 `.decorate`（如 db 插件），横切逻辑用 `onRequest` / `onError` 等生命周期钩子。

## 配置与环境变量

- 所有环境变量只在 `config/config.ts` 集中读取（用 `Bun.env`），业务代码从 `CONFIG` 对象取值，不直接读 `Bun.env` / `process.env`。
- 新增变量在 `config.ts` 登记并提供默认值，同时更新 `.env.example`。

## 日志

- 统一从 `lib/logger` 导入 `logger`，不要用 `console.log`。
- 日志级别由 `LOG_LEVEL` 控制；请求级日志走 `plugins/logger`。

## 代码风格

- 不写分号，字符串用单引号，4 空格缩进（与现有文件保持一致）。
- 文件名 kebab-case + 分层后缀（如 `users.routes.ts`、`users.service.ts`）。
- 导出对象/类型 camelCase / PascalCase（如 `usersService`、`NewUser`）。
- 优先用相对导入引用同模块/上层文件（现有代码未配置路径别名）。
- 注释使用中文，与现有代码一致。
- lint 用 `bun run lint`（eslint + typescript-eslint），提交前保持零警告。
