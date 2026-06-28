# 快速开始指南

## 项目已创建成功！ 🎉

这是一个现代化的全栈项目模板，包含以下技术栈：

### 前端 (client/)
- ⚡️ **Vite** - 超快的构建工具
- ⚛️ **React 18** - UI 框架
- 🔷 **TypeScript** - 类型安全
- 🎨 **Tailwind CSS v4** - 现代化的 CSS 框架
- 🧩 **ShadCN UI** - 精美的可访问组件库

### 后端 (server/)
- 🦊 **Elysia** - 基于 Bun 的高性能 Web 框架
- 🔷 **TypeScript** - 类型安全
- 🚀 **Bun** - 超快的 JavaScript 运行时

## 立即开始

### 1. 启动开发服务器

在项目根目录运行：

```bash
bun run dev
```

这将同时启动：
- 前端开发服务器：http://localhost:5173
- 后端 API 服务器：http://localhost:3000

### 2. 分别启动服务

如果你想单独启动某个服务：

```bash
# 只启动前端
bun run dev:client

# 只启动后端
bun run dev:server
```

## 项目结构

```
template_react_ts_tw_fullstack/
├── client/                 # 前端 React 应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   │   └── ui/       # ShadCN UI 组件
│   │   ├── lib/          # 工具函数
│   │   ├── App.tsx       # 主应用组件
│   │   ├── main.tsx      # 入口文件
│   │   └── index.css     # Tailwind v4 样式
│   ├── public/           # 静态资源
│   └── package.json
├── server/                # 后端 Elysia 应用
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   │   ├── hello.ts  # Hello API
│   │   │   └── users.ts  # Users CRUD API
│   │   └── index.ts      # 服务器入口
│   └── package.json
└── package.json           # 根工作区配置
```

## 可用的 API 端点

后端已经包含了示例 API：

- `GET /api/hello` - 简单的 Hello 消息
- `GET /api/hello/:name` - 个性化问候
- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 获取单个用户
- `POST /api/users` - 创建新用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

## 添加 ShadCN 组件

需要更多 UI 组件？使用 ShadCN CLI：

```bash
cd client
bunx shadcn@latest add [component-name]
```

例如：
```bash
bunx shadcn@latest add dialog
bunx shadcn@latest add input
bunx shadcn@latest add form
```

## 构建生产版本

```bash
# 构建所有
bun run build

# 只构建前端
bun run build:client

# 只构建后端
bun run build:server
```

## 代码检查

```bash
# 检查所有
bun run lint

# 只检查前端
bun run lint:client

# 只检查后端
bun run lint:server
```

## 生产部署

构建完成后，启动生产服务器：

```bash
bun run start
```

## 特性亮点

✅ **Monorepo 结构** - 使用 Bun workspaces 管理多包项目
✅ **热模块替换** - 前端即时更新，后端自动重启
✅ **类型安全** - 前后端完整的 TypeScript 支持
✅ **现代化 UI** - Tailwind v4 + ShadCN 预配置
✅ **API 代理** - Vite 开发服务器自动代理 `/api` 请求到后端
✅ **ESLint 配置** - 代码质量检查已配置
✅ **VSCode 优化** - 推荐扩展和设置已配置

## 下一步

1. 打开 `client/src/App.tsx` 开始编辑前端
2. 打开 `server/src/routes/` 添加新的 API 路由
3. 访问 http://localhost:5173 查看应用
4. 查看 README.md 了解更多详细信息

享受开发吧！ 🚀
