# 开发笔记

## 项目概述
这是一个完整的全栈模板项目，使用 Bun + React + TypeScript + Vite + ShadCN + Tailwind v4 + Elysia。

## 技术决策

### 前端架构
- **Vite**: 选择 Vite 而非 Webpack，因为它提供更快的开发体验和 HMR
- **Tailwind v4**: 使用最新的 alpha 版本，通过 @tailwindcss/vite 插件集成
- **ShadCN**: 提供了基于 Radix UI 的可访问组件，所有组件都是源码形式，可完全自定义

### 后端架构
- **Elysia**: 专为 Bun 设计的 Web 框架，性能极高
- **模块化路由**: 使用 Elysia 的 group 和独立路由文件组织 API
- **类型安全**: 使用 Elysia 的内置类型系统验证请求

### 项目结构
- **Monorepo**: 使用 Bun workspaces 管理前后端
- **代理配置**: Vite 开发服务器代理 /api 请求到后端端口 3000
- **并行脚本**: `bun run dev` 同时启动前后端开发服务器

## 已实现的功能

### 前端
- ✅ React 18 + TypeScript 严格模式
- ✅ Tailwind v4 配置和主题变量
- ✅ ShadCN UI 组件 (Button, Card)
- ✅ API 集成示例
- ✅ 响应式布局
- ✅ ESLint 配置

### 后端
- ✅ Elysia 服务器设置
- ✅ CORS 支持
- ✅ 模块化路由 (hello, users)
- ✅ CRUD API 示例
- ✅ 请求验证
- ✅ 错误处理

## 常见命令

```bash
# 开发
bun run dev              # 同时启动前后端
bun run dev:client       # 只启动前端
bun run dev:server       # 只启动后端

# 构建
bun run build            # 构建所有
bun run build:client     # 只构建前端
bun run build:server     # 只构建后端

# 检查
bun run lint             # 检查所有代码
bun run lint:client      # 只检查前端
bun run lint:server      # 只检查后端

# 生产
bun run start            # 启动生产服务器
```

## 扩展建议

### 添加数据库
推荐使用 Prisma 或 Drizzle ORM：
```bash
cd server
bun add prisma @prisma/client
bunx prisma init
```

### 添加状态管理
前端可以添加 Zustand 或 Jotai：
```bash
cd client
bun add zustand
```

### 添加路由
前端添加 React Router：
```bash
cd client
bun add react-router-dom
```

### 添加认证
后端可以使用 @elysiajs/jwt：
```bash
cd server
bun add @elysiajs/jwt
```

## 注意事项

1. **Tailwind v4 是 alpha 版本**: 可能存在一些不稳定性，生产环境建议使用 v3
2. **端口配置**: 前端 5173，后端 3000，确保端口未被占用
3. **ESLint 配置**: 使用了扁平配置格式 (eslint.config.js)，兼容 ESLint 9+

## 性能特点

- **Bun**: 比 Node.js 快 3-4 倍的包管理和运行时
- **Vite**: 毫秒级的 HMR
- **Elysia**: 比 Express 快 10+ 倍的请求处理
- **TypeScript**: 编译时类型检查，避免运行时错误
