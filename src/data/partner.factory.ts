import {
  ADDRESS_FRAGMENT,
  ADDRESS_QUERY,
  DEFAULT_PHONE,
  DEFAULT_SERVICE,
  DEFAULT_SUBSCRIPTION_TIER,
  PARTNER_TYPE_SERVICE,
} from '@data/static-data';
import { type Partner, PARTNER_NAME_PREFIX } from '@data/partner.types';

/**
 * Generates a unique, traceable partner name safe for parallel runs.
 * Format: QA_AUTO_<timestamp>_<4-char random>
 */
export function uniquePartnerName(): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${PARTNER_NAME_PREFIX}${Date.now()}_${suffix}`;
}

/**
 * Builds a fully valid Partner with unique identifiers.
 *
 * Pass a `Partial<Partner>` to override only the fields a test cares about
 * (e.g. `{ name: 'QA_AUTO_update_target' }` for an update scenario).
 */
export function partnerFactory(overrides: Partial<Partner> = {}): Partner {
  const uniqueName = uniquePartnerName();

  return {
    name: uniqueName,
    type: PARTNER_TYPE_SERVICE,
    services: [DEFAULT_SERVICE],
    subscriptionTier: DEFAULT_SUBSCRIPTION_TIER,
    addressQuery: ADDRESS_QUERY,
    expectedAddressFragment: ADDRESS_FRAGMENT,
    phone: DEFAULT_PHONE,
    contactPerson: `Contact ${uniqueName}`,
    ...overrides,
  };
}
