FROM oven/bun:1.2.21-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY src/web/package.json ./src/web/package.json
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1.2.21-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]