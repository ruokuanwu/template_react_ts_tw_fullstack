FROM oven/bun:1.2.21-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY web/package.json ./web/package.json
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1.2.21-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle

EXPOSE 3000

ENTRYPOINT ["bun", "run", "dist/index.js"]
CMD ["serve"]