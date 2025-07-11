import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class ScheduleRecording extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    datePicker: this.iFrame.getByRole('button', { name: 'Select Scheduled Start' }),
    witnessDropdown: this.iFrame.getByRole('button', { name: 'Select your Witness' }),
    defendantsDropdown: this.iFrame.getByRole('button', { name: 'Select your Defendants' }),
    saveButton: this.iFrame.getByTitle('Save'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.getByRole('heading', { name: 'Schedule a Recording' }),
    ScheduledRecordingHeading: this.iFrame.getByText('Scheduled Recordings', { exact: true }),
    saveCaseSuccessLogo: this.iFrame.locator('[data-control-name*="CaseConfirmationSuccess"]'),
    saveCaseSuccessText: this.iFrame.getByText('Save Successful', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnScheduleRecordingsPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible();
  }

  /**
   * Selects a date relative to today.
   * (positive = future, negative = past)
   * @param days Number of days to offset from today (optional)
   * @param months Number of months to offset from today (optional)
   * @param years Number of years to offset from today (optional)
   * @returns The formatted date as a string in dd/mm/yyyy format
   */

  public async selectDateFromToday(days: number = 0, months: number = 0, years: number = 0): Promise<string> {
    const datePickerPopup = this.iFrame.locator("[id*='datepicker'][id*='popup']");

    const isDatePickerHidden = await datePickerPopup.getAttribute('aria-hidden');
    if (isDatePickerHidden === 'true') {
      await this.$interactive.datePicker.click();
      await expect(datePickerPopup).toHaveAttribute('aria-hidden', 'false');
    }

    const targetDate: Date = new Date();
    if (years !== 0) targetDate.setFullYear(targetDate.getFullYear() + years);
    if (months !== 0) targetDate.setMonth(targetDate.getMonth() + months);
    if (days !== 0) targetDate.setDate(targetDate.getDate() + days);

    const year = targetDate.getFullYear().toString();
    const monthIndex = targetDate.getMonth();
    const day = targetDate.getDate();

    await datePickerPopup.locator('select.pika-select-year').selectOption(year);
    await datePickerPopup.locator('select.pika-select-month').selectOption(monthIndex.toString());
    await datePickerPopup.locator(`.pika-button[data-pika-year="${year}"][data-pika-month="${monthIndex}"][data-pika-day="${day}"]`).click();

    await datePickerPopup.locator('.appmagic-datepicker-ok-button').click();

    // Format date as dd/mm/yyyy
    const formattedDate = `${day.toString().padStart(2, '0')}/${(monthIndex + 1).toString().padStart(2, '0')}/${year}`;
    return formattedDate;
  }

  /**
   * Selects a witness from the dropdown.
   * If no name is provided, it selects the first witness in the list.
   * @param nameOfWitnessToSelect Name of the witness to select (optional)
   */
  public async selectWitnessFromDropDown(nameOfWitnessToSelect: string = ''): Promise<void> {
    const listBox = this.iFrame.getByRole('listbox', { name: 'Select your Witness items' });

    const isWitnessDropdownOpen = await this.$interactive.witnessDropdown.getAttribute('aria-expanded');
    if (isWitnessDropdownOpen !== 'true') {
      await this.$interactive.witnessDropdown.click();
      await expect(listBox).toBeVisible();
    } else {
      await expect(listBox).toBeVisible();
    }

    if (nameOfWitnessToSelect !== '') {
      await this.iFrame.getByText(nameOfWitnessToSelect, { exact: true }).click();
    } else {
      await listBox.locator('li[role="option"]').first().click();
    }
  }

  /**
   * Selects all defendants from the dropdown.
   * If the dropdown is not open, it opens it and selects each defendant.
   */
  public async selectAllDefendantsFromDropDown(): Promise<void> {
    const listBox = this.iFrame.getByRole('listbox', { name: 'Select your Defendants items' });

    const isDefendantDropdownOpen = await this.$interactive.defendantsDropdown.getAttribute('aria-expanded');
    if (isDefendantDropdownOpen !== 'true') {
      await this.$interactive.defendantsDropdown.click();
      await expect(listBox).toBeVisible();
    } else {
      await expect(listBox).toBeVisible();
    }

    const listOfDefendants = await listBox.locator('li[role="option"]').all();
    const defendantCount = listOfDefendants.length;
    for (let i = 0; i < defendantCount; i++) {
      const defendantToSelect = listOfDefendants[i];
      await defendantToSelect.click();
      await expect(listBox).toBeVisible();
    }
  }
}
