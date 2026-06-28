# Bun + React + TypeScript + Vite + ShadCN + Tailwind v4 + Elysia

A modern fullstack template with the best developer experience.

## Tech Stack

### Frontend
- ⚡️ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - UI library
- 🔷 **TypeScript** - Type safety
- 🎨 **Tailwind CSS v4** - Utility-first CSS framework
- 🧩 **ShadCN UI** - Beautiful, accessible components
- 🚀 **Bun** - Fast package manager and runtime

### Backend
- 🦊 **Elysia** - Ergonomic web framework built on Bun
- 🔷 **TypeScript** - Type safety
- 🚀 **Bun** - Ultra-fast JavaScript runtime

## Project Structure

```
.
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities
│   │   └── App.tsx      # Main app component
│   ├── public/          # Static assets
│   └── package.json
├── server/          # Backend Elysia application
│   ├── src/
│   │   ├── routes/      # API routes
│   │   └── index.ts     # Server entry point
│   └── package.json
└── package.json     # Root workspace config
```

## Getting Started

### Prerequisites

Make sure you have [Bun](https://bun.sh) installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation

Install dependencies for all workspaces:

```bash
bun install
```

### Development

Run both client and server in development mode:

```bash
bun run dev
```

This will start:
- Frontend dev server at http://localhost:5173
- Backend API server at http://localhost:3000

Or run them separately:

```bash
# Run only frontend
bun run dev:client

# Run only backend
bun run dev:server
```

### Build

Build for production:

```bash
bun run build
```

### Production

Start the production server:

```bash
bun run start
```

## Features

- 🔥 Hot Module Replacement (HMR) for instant feedback
- 📦 Monorepo structure with workspaces
- 🎨 Tailwind CSS v4 with modern features
- 🧩 Pre-configured ShadCN UI components
- 🔌 Type-safe API with Elysia
- ⚡️ Lightning-fast builds with Vite and Bun
- 🔒 TypeScript strict mode enabled
- 📝 ESLint configured for code quality

## Adding ShadCN Components

Add new ShadCN components:

```bash
cd client
bunx shadcn@latest add button
```

## API Routes

The backend uses Elysia for handling API routes. Example:

```typescript
app.get('/api/hello', () => ({ message: 'Hello from Elysia!' }))
```

## License

MIT
