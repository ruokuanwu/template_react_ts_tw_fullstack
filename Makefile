.PHONY: help install dev build lint start db-migrate docker-build docker-up docker-down docker-logs clean

COMPOSE := docker compose -f deploy/dev/docker-compose.yml

help:
	@printf '%s\n' \
		'install       Install dependencies' \
		'dev           Start backend and frontend in development mode' \
		'build         Build backend and frontend' \
		'lint          Run all linters' \
		'start         Start the application locally' \
		'db-migrate    Run database migrations' \
		'docker-build  Build the development Docker image' \
		'docker-up     Start the development stack' \
		'docker-down   Stop the development stack' \
		'docker-logs   Follow development stack logs' \
		'clean         Remove build output'

install:
	bun install --frozen-lockfile

dev:
	bun run dev

build:
	bun run build

lint:
	bun run lint

start:
	bun run start

db-migrate:
	bun run db:migrate

docker-build:
	$(COMPOSE) build

docker-up:
	$(COMPOSE) up -d --build

docker-down:
	$(COMPOSE) down

docker-logs:
	$(COMPOSE) logs -f

clean:
	rm -rf dist