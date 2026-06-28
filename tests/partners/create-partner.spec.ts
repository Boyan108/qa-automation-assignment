import { test, expect } from '@fixtures/index';

test.describe('Partners — create', () => {
  test('creates a new partner with all required fields', async ({ partnersPage, partner }) => {
    await partnersPage.open();
    const form = await partnersPage.openNewPartnerForm();

    const committedAddress = await form.fillRequiredFields(partner);
    expect(committedAddress).toContain(partner.expectedAddressFragment);

    await form.save();

    await partnersPage.search(partner.name);
    await expect(partnersPage.partnerRow(partner.name)).toBeVisible();
  });
});
