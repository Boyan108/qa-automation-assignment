/**
 * Framework-wide constants. Kept separate from environment configuration
 * because these values are intrinsic to the framework, not the environment.
 */

/** Location of the persisted authenticated session (see auth setup). */
export const STORAGE_STATE_PATH = 'playwright/.auth/user.json';

/**
 * Centralized timeouts (ms). Defining them once keeps timing behaviour
 * consistent and tunable from a single place rather than scattered magic
 * numbers across the suite.
 */
export const TIMEOUTS = {
  /** Default per-action timeout (clicks, fills, etc.). */
  action: 15_000,
  /** Page navigation timeout. */
  navigation: 30_000,
  /** Web-first assertion (`expect`) timeout. */
  expect: 10_000,
  /** Overall per-test timeout. */
  test: 60_000,
} as const;
