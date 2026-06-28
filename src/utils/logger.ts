import { env } from '@config/env';

/**
 * Minimal, dependency-free, level-aware logger.
 *
 * Purpose: emit a readable narrative of high-level test steps (login, navigate,
 * create, save) so CI logs are understandable at a glance without opening a
 * trace. Low-level actions are intentionally NOT logged here — Playwright's
 * trace already captures every click and network call.
 *
 * Verbosity is controlled by the LOG_LEVEL environment variable.
 */
const LOG_LEVELS = ['error', 'warn', 'info', 'debug'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function resolveLevel(value: string): LogLevel {
  return (LOG_LEVELS as readonly string[]).includes(value) ? (value as LogLevel) : 'info';
}

const activeLevel = resolveLevel(env.logLevel);

function shouldLog(level: LogLevel): boolean {
  return PRIORITY[level] <= PRIORITY[activeLevel];
}

function write(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!shouldLog(level)) return;

  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`;
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  sink(line, ...args);
}

export const logger = {
  error: (message: string, ...args: unknown[]): void => write('error', message, ...args),
  warn: (message: string, ...args: unknown[]): void => write('warn', message, ...args),
  info: (message: string, ...args: unknown[]): void => write('info', message, ...args),
  debug: (message: string, ...args: unknown[]): void => write('debug', message, ...args),

  /** Logs a high-level test step at info level, prefixed for visibility. */
  step: (message: string): void => write('info', `▶ ${message}`),
};
