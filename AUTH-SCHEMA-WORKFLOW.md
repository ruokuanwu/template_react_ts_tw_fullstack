# Better Auth schema 生成与迁移流程

## 职责与版本

- Better Auth 配置：[认证服务](./internal/module/auth/service.ts)。
- CLI 生成的 Drizzle 表定义：[auth.ts](./internal/db/schema/auth.ts)。不要凭记忆手写认证必需字段。
- Schema 统一导出：[index.ts](./internal/db/schema/index.ts)。
- Drizzle 迁移配置：[drizzle.config.ts](./drizzle.config.ts)，迁移历史位于 [drizzle](./drizzle)。
- 当前运行库与生成器均为 `1.7.2`。官方现行 CLI 包名为 `auth`；`@better-auth/cli@1.7.2` 不存在。升级 Better Auth 时应同步检查 `auth:generate` 中固定的 CLI 版本。
- CLI 要求配置文件默认导出认证实例，或导出名为 `auth` 的实例。本项目保留 `authService`，额外导出同一实例的 `auth` 别名。

参考：[Better Auth CLI 文档](https://www.better-auth.com/docs/concepts/cli)。

## 常规流程（PowerShell，仓库根目录）

先设置当前进程的数据库地址。正式数据库操作前备份数据库；不要将密钥写入源码或提交到仓库。

```powershell
$env:DATABASE_URL = 'file:local.db'
$env:BETTER_AUTH_URL = 'http://localhost:3000'
# BETTER_AUTH_SECRET 应通过本地环境或被 Git 忽略的 .env 提供。

bun run auth:generate
# 仅在上一条成功后继续。
bun run db:generate
# 检查新生成的 SQL，确认没有非预期的删表、删列或数据丢失。
bun run db:migrate

bun test .\internal\module\auth\service.test.ts
bun run lint:server
bun x tsc --noEmit
bun run build:server
```

`auth:generate` 实际执行：

```powershell
bun x --bun auth@1.7.2 generate --config .\internal\module\auth\service.ts --output .\internal\db\schema\auth.ts --yes
```

这里的 `--yes` 会允许覆盖生成文件。认证字段扩展应先修改 Better Auth 的 `additionalFields` 或插件配置，再重新生成、审查迁移和验证，而不是只改生成文件。业务专属数据也可放在关联的业务表中。

Drizzle 适配器使用 `db:generate` / `db:migrate` 管理迁移，不使用面向其他适配器的 Better Auth migrate 命令。生成 TypeScript 表定义本身不会更新数据库。

## auth.ts 被删除后的引导步骤

如果 [schema/index.ts](./internal/db/schema/index.ts) 仍然导出已删除的 `./auth`，CLI 加载认证配置时也会遇到缺失模块，因为导入链为：认证配置 → 数据库 → schema 入口 → auth.ts。

1. 暂时将 schema 入口改为 `export {};`。如果还有其他业务表，仅移除缺失的认证表导出，保留业务表导出。
2. 执行 `bun run auth:generate`，生成真实表定义。不要写一套假的认证表来引导。
3. 恢复入口的 `export * from "./auth";`。
4. 再执行常规迁移和验证步骤。

临时空入口仅用于生成阶段，不能用于运行认证服务。

## 本次执行记录（2026-11-14）

1. 确认认证表文件已删除，schema 入口仍指向缺失文件。
2. 使用 `bun x --bun`：此机器没有可直接调用的 `bunx` 命令。
3. 查询现行官方 CLI 文档，使用与运行库匹配的 `auth@1.7.2`。
4. 临时清空缺失导出，为认证实例增加 `auth` 别名，成功生成四张认证表及其关系；随后恢复 schema 导出。生成的表定义未手工修改。
5. 在 [package.json](./package.json) 增加可复用的 `auth:generate` 脚本，并再次运行成功。
6. 执行 `db:generate`，新增 [0001 迁移](./drizzle/0001_silent_randall_flagg.sql)，保留原有 0000 历史。新 schema 移除了多处时间戳的 SQL 默认值，时间由认证逻辑提供；迁移通过重建表并复制数据实现该变更。
7. 对本地 `local.db` 执行迁移成功。再次生成提示无结构变化，再次迁移成功。
8. 增加 [认证集成测试](./internal/module/auth/service.test.ts)：使用独立临时 SQLite 数据库应用全部迁移，通过真实 Better Auth handler 验证注册、错误密码拒绝、登录、Cookie 会话读取、退出后会话失效；结束后删除测试数据库。该测试不等于浏览器或 Elysia 路由端到端验证。

### 验证结果与已有问题

- 认证集成测试：通过。
- 后端 ESLint：通过。
- 后端打包：通过。
- 迁移重复执行、schema 无差异检查：通过。
- 全项目 TypeScript 检查未通过：现有 [CORS 中间件](./internal/middleware/cors.ts) 使用 `config.clientUrl`，但当前配置已无此属性。本次未恢复用户此前移除的配置。
- 额外运行现有 CLI 测试：迁移测试和帮助测试通过；cron 测试失败（现有 CLI 已无 cron 分支），运行时测试失败（引用的 `internal/app/run` 模块不存在）。这些不是本次生成引入的问题，未修改。
- 尝试经现有 Elysia 应用验证会话 GET 时，返回了 HTML 而非认证 JSON；最终认证测试直接使用 Better Auth handler，以隔离 schema 验证。应用层路由与静态页面回退仍需另行排查，不能据此宣称浏览器登录链路已验证。
- 未设置 `BETTER_AUTH_URL` 时 CLI 会警告基础地址未设置；生成仍可成功。实际部署应提供认证 URL 和高强度密钥。
