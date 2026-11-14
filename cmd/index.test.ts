import { afterAll, expect, test } from 'bun:test'
import { Database } from 'bun:sqlite'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const temp = mkdtempSync(join(tmpdir(), 'template-cli-'))
const entry = join(root, 'cmd', 'index.ts')
const decoder = new TextDecoder()

const run = (args: string[], database = 'cli.db') => {
    const result = Bun.spawnSync([process.execPath, 'run', entry, ...args], {
        cwd: root,
        env: { ...process.env, DATABASE_URL: join(temp, database) },
        stdout: 'pipe',
        stderr: 'pipe',
    })
    return {
        code: result.exitCode,
        output: decoder.decode(result.stdout) + decoder.decode(result.stderr),
    }
}

afterAll(() => rmSync(temp, { recursive: true, force: true }))

test('help succeeds and unknown commands fail', () => {
    for (const args of [[], ['help'], ['--help'], ['-h']]) {
        const result = run(args)
        expect(result.code).toBe(0)
        expect(result.output).toContain('serve')
    }
    expect(run(['unknown']).code).toBe(1)
    expect(run(['serve', 'unexpected']).code).toBe(1)
    expect(run(['migrate', 'unexpected']).code).toBe(1)
})

test('cron receives the job argument and rejects invalid jobs', () => {
    const result = run(['cron', 'cleanup'])
    expect(result.code).toBe(0)
    expect(result.output).toContain('Cleanup job completed')
    for (const args of [['cron'], ['cron', 'unknown'], ['cron', 'toString'], ['cron', 'cleanup', 'extra']]) {
        expect(run(args).code).toBe(1)
    }
})

test('migration command applies migrations and can run again', () => {
    for (let attempt = 0; attempt < 2; attempt++) {
        const result = run(['migrate'], 'migration.db')
        expect(result.code).toBe(0)
        expect(result.output).toContain('Database migrations completed')
    }
    const db = new Database(join(temp, 'migration.db'), { readonly: true })
    try {
        expect(db.query("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'user'").get()).not.toBeNull()
    } finally {
        db.close()
    }
})

test('app creation does not listen; runtime serves HTTP and stops cleanly', () => {
    const script = `
        const { createApp } = await import('./internal/app');
        if (createApp().server) throw new Error('createApp must not listen');
        const { runApp } = await import('./internal/app/run');
        const runtime = runApp();
        try {
            const response = await fetch(runtime.app.server.url + 'api/hello');
            const body = await response.json();
            if (response.status !== 200 || body.message !== 'Hello from Elysia!') {
                throw new Error('Unexpected hello response');
            }
        } finally {
            await runtime.stop();
            await runtime.stop();
        }
    `
    const result = Bun.spawnSync([process.execPath, '-e', script], {
        cwd: root,
        env: { ...process.env, PORT: '0', DATABASE_URL: join(temp, 'server.db') },
        stdout: 'pipe',
        stderr: 'pipe',
    })
    expect(decoder.decode(result.stderr)).not.toContain('error:')
    expect(result.exitCode).toBe(0)
    expect(decoder.decode(result.stdout)).toContain('Elysia server stopped')
})
