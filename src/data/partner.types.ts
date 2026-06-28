/**
 * Typed model for a Partner entity as represented in the create/edit form.
 */
export interface Partner {
  name: string;
  type: string;
  services: readonly string[];
  subscriptionTier: string;
  /** Text typed into Google Places autocomplete (e.g. "Sofia, Bulgaria"). */
  addressQuery: string;
  /** Substring expected in the committed address after autocomplete selection. */
  expectedAddressFragment: string;
  /** Local phone number; the form defaults to Bulgaria (+359). */
  phone: string;
  contactPerson: string;
  description?: string;
}

/** Prefix applied to all factory-generated partner names for traceability. */
export const PARTNER_NAME_PREFIX = 'QA_AUTO_';
