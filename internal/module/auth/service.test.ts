import { expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

test('generated schema supports registration, login, session lookup and logout', () => {
    const root = resolve(import.meta.dir, '..', '..', '..')
    const temp = mkdtempSync(join(tmpdir(), 'template-auth-'))
    try {
        const result = Bun.spawnSync([process.execPath, '-e', `
            import { expect } from 'bun:test';
            import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
            const { db, client } = await import('./internal/db');
            try {
                migrate(db, { migrationsFolder: './drizzle' });
                const { authService } = await import('./internal/module/auth/service');
                const request = (path, body, cookie) => authService.handler(new Request(
                    'http://localhost:3000/api/auth/' + path,
                    {
                        method: body ? 'POST' : 'GET',
                        headers: {
                            'content-type': 'application/json',
                            origin: 'http://localhost:3000',
                            ...(cookie ? { cookie } : {}),
                        },
                        ...(body ? { body: JSON.stringify(body) } : {}),
                    },
                ));
                const credentials = {
                    email: 'schema-test@example.com',
                    password: 'Schema-test-password-123!',
                };
                const signup = await request('sign-up/email', {
                    ...credentials, name: 'Schema Test',
                });
                expect(signup.status).toBe(200);
                expect((await signup.json()).user.email).toBe(credentials.email);
                const wrong = await request('sign-in/email', {
                    ...credentials, password: 'Incorrect-password-123!',
                });
                expect(wrong.status).toBe(401);
                const login = await request('sign-in/email', credentials);
                expect(login.status).toBe(200);
                const cookie = login.headers.getSetCookie()
                    .map(value => value.split(';')[0]).join('; ');
                expect(cookie).toContain('session_token');
                const session = await request('get-session', undefined, cookie);
                expect(session.status).toBe(200);
                expect((await session.json()).user.email).toBe(credentials.email);
                const logout = await request('sign-out', {}, cookie);
                expect(logout.status).toBe(200);
                const expired = await request('get-session', undefined, cookie);
                expect(await expired.json()).toBeNull();
            } finally {
                client.close();
            }
        `], {
            cwd: root,
            env: {
                ...process.env,
                DATABASE_URL: join(temp, 'auth.db'),
                BETTER_AUTH_URL: 'http://localhost:3000',
                BETTER_AUTH_SECRET: 'test-only-secret-for-generated-schema-123456789',
            },
            stdout: 'pipe',
            stderr: 'pipe',
        })
        const output = new TextDecoder().decode(result.stdout)
            + new TextDecoder().decode(result.stderr)
        expect(result.exitCode, output).toBe(0)
    } finally {
        rmSync(temp, { recursive: true, force: true })
    }
})
