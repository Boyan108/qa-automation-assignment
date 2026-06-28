import fs from 'node:fs';
import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { STORAGE_STATE_PATH } from '@config/constants';

interface StorageStateOrigin {
  localStorage?: Array<{ name: string; value: string }>;
}

interface StorageState {
  origins?: StorageStateOrigin[];
}

/**
 * Reads the Bearer token persisted by the auth setup from storageState.
 * The admin SPA stores auth in localStorage; API calls require the same header.
 */
export function getAccessTokenFromStorageState(
  storageStatePath = STORAGE_STATE_PATH,
): string {
  const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf8')) as StorageState;
  const authEntry = state.origins?.[0]?.localStorage?.find((entry) => entry.name === 'auth');
  if (!authEntry) {
    throw new Error(`No auth token found in storage state at ${storageStatePath}`);
  }

  const auth = JSON.parse(authEntry.value) as { accessToken?: string };
  if (!auth.accessToken) {
    throw new Error('Storage state auth entry is missing accessToken');
  }

  return auth.accessToken;
}

/**
 * Thin wrapper around Playwright's APIRequestContext with JSON helpers and
 * consistent error messages.
 */
export class HttpClient {
  constructor(private readonly request: APIRequestContext) {}

  async getJson<T>(url: string, params?: Record<string, string>): Promise<T> {
    const response = await this.request.get(url, { params });
    return this.parseJson<T>(response, `GET ${url}`);
  }

  async delete(url: string): Promise<void> {
    const response = await this.request.delete(url);
    if (!response.ok() && response.status() !== 404) {
      throw new Error(`DELETE ${url} failed: ${response.status()} ${await response.text()}`);
    }
  }

  private async parseJson<T>(response: APIResponse, label: string): Promise<T> {
    if (!response.ok()) {
      throw new Error(`${label} failed: ${response.status()} ${await response.text()}`);
    }
    return response.json() as Promise<T>;
  }
}
