import { type Locator, type Page } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * Component Object for the Google Places address autocomplete.
 *
 * This is the most fragile widget in the form: it is third-party, network-
 * dependent, and renders its suggestion list (`.pac-container`) in a body
 * portal. Two deliberate choices make it reliable:
 *
 *  1. We type with `pressSequentially` (real, trusted keystrokes). Google's
 *     Autocomplete only reacts to trusted key events — `fill()` or synthetic
 *     events set the value but never trigger predictions.
 *  2. We select with the keyboard (ArrowDown + Enter) instead of clicking a
 *     suggestion. The panel hides on blur, so a click race is a classic source
 *     of flakiness; keyboard selection sidesteps it entirely.
 */
export class AddressAutocomplete {
  private readonly input: Locator;
  private readonly suggestions: Locator;

  constructor(private readonly page: Page) {
    this.input = page.locator('input.pac-target-input');
    this.suggestions = page.locator('.pac-container .pac-item');
  }

  /**
   * Types an address query, waits for Google's predictions, and selects the
   * first suggestion. Returns the value committed to the input so callers can
   * assert on what was actually selected.
   */
  async enter(query: string): Promise<string> {
    logger.debug(`Entering address "${query}"`);

    await this.input.click();
    await this.input.fill('');
    await this.input.pressSequentially(query, { delay: 100 });

    await this.suggestions.first().waitFor({ state: 'visible' });

    await this.input.press('ArrowDown');
    await this.input.press('Enter');

    return this.input.inputValue();
  }
}
