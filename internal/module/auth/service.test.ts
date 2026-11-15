import { expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

test.each([
    { name: 'default development origin', nodeEnv: 'development', clientUrl: undefined, origin: 'http://localhost:5173' },
    { name: 'configured production origin', nodeEnv: 'production', clientUrl: 'https://app.example.com', origin: 'https://app.example.com' },
])('registration, login, session lookup and logout support $name', (scenario) => {
    const root = resolve(import.meta.dir, '..', '..', '..')
    const temp = mkdtempSync(join(tmpdir(), 'template-auth-'))
    try {
        const result = Bun.spawnSync([process.execPath, '-e', `
            import { expect } from 'bun:test';
            import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
            const { db, client } = await import('./internal/db');
            try {
                migrate(db, { migrationsFolder: './drizzle' });
                const { auth } = await import('./internal/module/auth/service');
                expect(auth.options.baseURL).toBe('http://localhost:4000');
                const request = (path, body, cookie, origin = ${JSON.stringify(scenario.origin)}) => auth.handler(new Request(
                    'http://localhost:4000/api/auth/' + path,
                    {
                        method: body ? 'POST' : 'GET',
                        headers: {
                            'content-type': 'application/json',
                            origin,
                            ...(cookie ? { cookie } : {}),
                        },
                        ...(body ? { body: JSON.stringify(body) } : {}),
                    },
                ));
                const credentials = {
                    email: 'schema-test@example.com',
                    password: 'Schema-test-password-123!',
                };
                const rejected = await request('sign-up/email', {
                    ...credentials, name: 'Schema Test',
                }, undefined, 'https://untrusted.example.com');
                expect(rejected.status).toBe(403);
                expect((await rejected.json()).code).toBe('INVALID_ORIGIN');
                const signup = await request('sign-up/email', {
                    ...credentials, name: 'Schema Test',
                });
                expect(signup.status).toBe(200);
                expect((await signup.json()).user.email).toBe(credentials.email);
                const backendOrigin = await request('sign-in/email', credentials, undefined, 'http://localhost:4000');
                expect(backendOrigin.status).toBe(200);
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
                NODE_ENV: scenario.nodeEnv,
                CLIENT_URL: scenario.clientUrl,
                DATABASE_URL: join(temp, 'auth.db'),
                BETTER_AUTH_URL: 'http://localhost:4000',
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
