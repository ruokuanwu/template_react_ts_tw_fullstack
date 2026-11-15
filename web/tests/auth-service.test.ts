import { expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

test('Better Auth SDK registers, restores sessions, logs in and signs out against the real handler', () => {
  const directory = mkdtempSync(join(tmpdir(), 'orbit-auth-'))
  try {
    const result = Bun.spawnSync([process.execPath, '-e', `
      import { expect } from 'bun:test';
      import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
      import { createAuthClient } from 'better-auth/client';
      const { db, client } = await import('./internal/db');
      try {
        migrate(db, { migrationsFolder: './drizzle' });
        const { auth } = await import('./internal/module/auth/service');
        let cookie = '';
        const sdk = createAuthClient({
          baseURL: 'http://localhost:3000',
          fetchOptions: {
            customFetchImpl: async (url, options) => {
              const headers = new Headers(options?.headers);
              headers.set('origin', 'http://localhost:3000');
              if (cookie) headers.set('cookie', cookie);
              const response = await auth.handler(new Request(url, { ...options, headers }));
              const updated = response.headers.getSetCookie();
              if (updated.length) cookie = updated.map(value => value.split(';')[0]).join('; ');
              return response;
            },
          },
        });
        const credentials = { email: 'creator@example.com', password: 'Orbit-test-password-123!' };
        const signup = await sdk.signUp.email({ ...credentials, name: 'Creator' });
        expect(signup.error).toBeNull();
        expect(signup.data.user.name).toBe('Creator');
        expect((await sdk.getSession()).data.user.email).toBe(credentials.email);
        expect((await sdk.signOut()).error).toBeNull();
        expect((await sdk.getSession()).data).toBeNull();
        expect((await sdk.signIn.email({ ...credentials, password: 'wrong' })).error.code).toBe('INVALID_EMAIL_OR_PASSWORD');
        expect((await sdk.signIn.email(credentials)).error).toBeNull();
        expect((await sdk.getSession({ query: { disableCookieCache: true } })).data.user.email).toBe(credentials.email);
        expect((await sdk.signUp.email({ ...credentials, name: 'Duplicate' })).error).not.toBeNull();
        expect((await sdk.signOut()).error).toBeNull();
        expect((await sdk.getSession()).data).toBeNull();
      } finally {
        client.close();
      }
    `], {
      cwd: resolve(import.meta.dir, '..', '..'),
      env: { ...process.env, DATABASE_URL: join(directory, 'auth.db'), BASE_URL: 'http://localhost:3000', BETTER_AUTH_SECRET: 'test-only-orbit-auth-secret-at-least-32-characters' },
      stdout: 'pipe',
      stderr: 'pipe',
    })
    const output = new TextDecoder().decode(result.stdout) + new TextDecoder().decode(result.stderr)
    expect(result.exitCode, output).toBe(0)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
