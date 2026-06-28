import { test, expect } from '@fixtures/index';

test.describe('Partners — update', () => {
  test('updates an existing partner and validates persisted changes', async ({
    partnersPage,
    partner,
    partnerApi,
  }) => {
    const updatedContact = `${partner.contactPerson} UPDATED`;

    await partnersPage.open();
    const createForm = await partnersPage.openNewPartnerForm();
    await createForm.fillRequiredFields(partner);
    await createForm.save();

    await partnersPage.search(partner.name);
    await expect(partnersPage.partnerRow(partner.name)).toBeVisible();

    const existing = await partnerApi.findByName(partner.name);
    expect(existing?.name).toBe(partner.name);

    const editForm = await partnersPage.openEditFormFor(partner.name);
    await editForm.fillContactPerson(updatedContact);
    await editForm.save();

    await partnersPage.search(partner.name);
    await expect(partnersPage.partnerRow(partner.name)).toContainText(updatedContact);
  });
});
