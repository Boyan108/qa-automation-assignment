import { type Locator, type Page } from '@playwright/test';
import { AddressAutocomplete } from '@components/AddressAutocomplete';
import { Dropdown } from '@components/Dropdown';
import { type Partner } from '@data/partner.types';
import { logger } from '@utils/logger';

/**
 * Page Object for the Partner create/edit modal.
 *
 * Composes Dropdown and AddressAutocomplete components rather than inlining
 * widget logic. Field order in `fillRequiredFields` follows the form's
 * dependencies (Type must be set before Services becomes interactive).
 */
export class PartnerFormPage {
  private readonly modal: Locator;
  private readonly nameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly contactPersonInput: Locator;
  private readonly saveButton: Locator;

  private readonly typeDropdown: Dropdown;
  private readonly servicesDropdown: Dropdown;
  private readonly subscriptionDropdown: Dropdown;
  private readonly addressAutocomplete: AddressAutocomplete;

  constructor(private readonly page: Page) {
    this.modal = page.locator('.ant-modal');
    this.nameInput = this.modal.getByPlaceholder('Write partner name');
    this.phoneInput = this.modal.locator('input.PhoneInputInput');
    this.contactPersonInput = this.modal.getByPlaceholder('Names of contact person');
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });

    this.typeDropdown = new Dropdown(page, page.locator('.ant-select:has(#partner-type-field)'));
    this.servicesDropdown = new Dropdown(
      page,
      page.locator('.ant-select:has(#service-types-field)'),
    );
    this.subscriptionDropdown = new Dropdown(
      page,
      page.locator('.ant-select:has(#subscription-tier-field)'),
    );
    this.addressAutocomplete = new AddressAutocomplete(page);
  }

  async waitForOpen(): Promise<void> {
    await this.modal.waitFor({ state: 'visible' });
    await this.nameInput.waitFor({ state: 'visible' });
  }

  /**
   * Populates all required fields. Returns the committed address value for
   * downstream assertions.
   */
  async fillRequiredFields(partner: Partner): Promise<string> {
    logger.step(`Filling partner form for "${partner.name}"`);

    await this.nameInput.fill(partner.name);
    await this.typeDropdown.choose(partner.type);
    await this.servicesDropdown.chooseMany(partner.services);
    await this.subscriptionDropdown.choose(partner.subscriptionTier);

    const committedAddress = await this.addressAutocomplete.enter(partner.addressQuery);

    await this.phoneInput.fill(partner.phone);
    await this.contactPersonInput.fill(partner.contactPerson);

    return committedAddress;
  }

  async save(): Promise<void> {
    logger.step('Saving partner');
    await this.saveButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async fillContactPerson(name: string): Promise<void> {
    await this.contactPersonInput.fill(name);
  }
}
