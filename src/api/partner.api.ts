import { type HttpClient } from '@api/http-client';
import { logger } from '@utils/logger';

export interface PartnerRecord {
  uuid: string;
  name: string;
}

interface PartnerListResponse {
  data: PartnerRecord[];
}

/**
 * Minimal API client for partner test-data management (lookup + teardown).
 * UI flows remain the source of truth for create/update assertions.
 */
export class PartnerApi {
  constructor(
    private readonly http: HttpClient,
    private readonly baseUrl: string,
  ) {}

  async findByName(name: string): Promise<PartnerRecord | undefined> {
    const response = await this.http.getJson<PartnerListResponse>(
      `${this.baseUrl}/admin/partner/0/10`,
      { search: name },
    );
    return response.data.find((partner) => partner.name === name);
  }

  async deleteByUuid(uuid: string): Promise<void> {
    logger.debug(`Deleting partner ${uuid} via API`);
    await this.http.delete(`${this.baseUrl}/admin/partner/${uuid}`);
  }

  async deleteByName(name: string): Promise<void> {
    const partner = await this.findByName(name);
    if (partner) {
      await this.deleteByUuid(partner.uuid);
    }
  }
}
