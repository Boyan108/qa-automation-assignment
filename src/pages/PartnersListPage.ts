import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { PartnerFormPage } from '@pages/PartnerFormPage';
import { logger } from '@utils/logger';

/**
 * Page Object for the Partners list view (`/partners`).
 */
export class PartnersListPage extends BasePage {
  private static readonly PATH = '/partners';

  private readonly searchInput: Locator;
  private readonly newPartnerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('searchbox', { name: 'Search by partners...' });
    this.newPartnerButton = page.getByRole('button', { name: 'New partner' });
  }

  async open(): Promise<void> {
    logger.step('Opening Partners list');
    await this.goto(PartnersListPage.PATH);
    await this.newPartnerButton.waitFor({ state: 'visible' });
  }

  async search(term: string): Promise<void> {
    logger.debug(`Searching partners for "${term}"`);
    await this.searchInput.fill(term);
  }

  /** Opens the create-partner modal and returns the form page object. */
  async openNewPartnerForm(): Promise<PartnerFormPage> {
    logger.step('Opening New partner form');
    await this.newPartnerButton.click();
    const form = new PartnerFormPage(this.page);
    await form.waitForOpen();
    return form;
  }

  /** Locates a table row containing the given partner name. */
  partnerRow(name: string): Locator {
    return this.page.locator('tr').filter({ hasText: name });
  }

  /** Opens the edit form for a partner visible in the current list. */
  async openEditFormFor(name: string): Promise<PartnerFormPage> {
    logger.step(`Opening edit form for partner "${name}"`);
    const row = this.partnerRow(name);
    await row.getByRole('button').click();
    const form = new PartnerFormPage(this.page);
    await form.waitForOpen();
    return form;
  }
}
