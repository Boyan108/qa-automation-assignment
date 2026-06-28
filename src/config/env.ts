import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Reads a required environment variable and fails fast with an actionable
 * message if it is missing. Failing at load time (rather than mid-test with a
 * cryptic error) keeps environment problems cheap to diagnose.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Copy ".env.example" to ".env" and provide a value (see README).`,
    );
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value !== undefined && value.trim() !== '' ? value : fallback;
}

/**
 * Strongly-typed, validated application configuration.
 *
 * This is the single source of truth for environment-derived values. Tests and
 * page objects never read `process.env` directly — they import from here, so the
 * environment contract lives in one place.
 */
export const env = {
  baseURL: requireEnv('BASE_URL'),
  credentials: {
    email: requireEnv('USER_EMAIL'),
    password: requireEnv('USER_PASSWORD'),
  },
  isCI: process.env.CI === 'true' || process.env.CI === '1',
  logLevel: optionalEnv('LOG_LEVEL', 'info'),
} as const;

export type Env = typeof env;
