import { expect, Locator, Page } from '@playwright/test';

export class UserInterfaceUtils {
  constructor(public readonly page: Page) {}
  /**
   * Hides the specified element(s) by setting their visibility to 'hidden'.
   * This is useful for visual testing where you want to hide certain elements.
   * Playwright does offer support for masking elements during visual testing,
   * but this method provides a simple way to hide elements which can overlap modals etc... during masking.
   * Use of this method should be limited to scenarios where masking is not sufficient or applicable.
   * Verifies if the element is visible before hiding it.
   * Verifies that the element is hidden after applying the style.
   * @param elementToHide - The element or array of elements to hide.
   */
  public async hideElements(elementToHide: Locator | Locator[]) {
    const elements = Array.isArray(elementToHide) ? elementToHide : [elementToHide];

    for (const el of elements) {
      await expect(el).toBeVisible();

      await el.evaluate((node) => {
        node.style.visibility = 'hidden';
      });
      await expect(el).toBeHidden();
    }
  }

  /**
   * Replaces dynamic text using specified string or regex to identify what needs replacing with an alternative string provided.
   * This is useful for visual testing where you want to ensure dynamic information is not visible in screenshots.
   * Verifies that the locator is a <textarea> element before proceeding with the replacement.
   * Verifies that the locator is visible and not empty before replacing text.
   * Verifies that the locator's value has been updated with the replaced text after applying the replacements.
   * example usage:
   * await userInterfaceUtils.replaceTextWithinTextArea(locator, [
   *   [/PR-\d+/, 'PR-XXXXXX'],
   *   ['PR-1234567890', 'XXXXXXXXXXXXX'],
   *   [/\d{2}\/\d{2}\/\d{4}/, 'DD/MM/YYYY'],
   * ]);
   * @param locator - The locator whose text will be replaced.
   * @param replacements - An array of tuples where each tuple contains a pattern (string or RegExp) and its replacement string.
   */
  public async replaceTextWithinTextArea(locator: Locator, replacements: Array<[string | RegExp, string]>): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).not.toBeEmpty();

    const redactedText = await locator.evaluate((node, replacements) => {
      const isTextArea = node.tagName.toLowerCase() === 'textarea';
      if (!isTextArea) {
        throw new Error(`The provided locator {${locator}} is not a <textarea> element.`);
      }

      const textarea = node as HTMLTextAreaElement;
      let inputValue = textarea.value;

      for (const [replacementPattern, replacementText] of replacements) {
        if (typeof replacementPattern === 'string' || replacementPattern instanceof RegExp) {
          inputValue = inputValue.replace(replacementPattern, replacementText);
        }
      }

      textarea.value = inputValue;
      return inputValue;
    }, replacements);

    await expect(locator).toHaveValue(redactedText);
  }
}
