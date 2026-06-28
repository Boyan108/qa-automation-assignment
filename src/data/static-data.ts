/**
 * Static reference values for the Partners form.
 *
 * Centralises locale-specific labels and default dropdown selections so tests
 * and page objects never scatter magic strings. Values are grounded in the live
 * dev app (see exploration notes in README).
 */

/** Partner Type dropdown — visible label for a service centre. */
export const PARTNER_TYPE_SERVICE = 'Service';

/** Default service selected in the multi-select Услуги field. */
export const DEFAULT_SERVICE = 'Смяна на гуми';

/** Default subscription tier (Абонаментен план). */
export const DEFAULT_SUBSCRIPTION_TIER = 'Смяна на масло';

/** Query typed into Google Places; first suggestion resolves to Sofia, Bulgaria. */
export const ADDRESS_QUERY = 'Sofia, Bulgaria';

/** Fragment used to assert the committed address after autocomplete. */
export const ADDRESS_FRAGMENT = 'Sofia';

/** Default local phone number (Bulgaria country code is pre-selected in the form). */
export const DEFAULT_PHONE = '887654321';
