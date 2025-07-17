import { Page, Locator, expect } from '@playwright/test';
import { config } from '../../../utils';

export class CvpRoomSettingsPage {
  constructor(public readonly page: Page) {}

  public readonly $interactive = {
    selectRoomDropdown: this.page.locator('#roomNameDropdown'),
    editRoomSettingsButton: this.page.getByRole('tab', { name: 'Edit room settings' }),
    saveSettingsButton: this.page.getByRole('button', { name: 'Save' }),
    recordButton: this.page.getByRole('button', { name: 'Record' }),
    endCallButton: this.page.getByRole('button', { name: 'End call' }),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    rmptsLinkInput: this.page.getByRole('textbox', { name: 'Recording URI:' }),
  } as const satisfies Record<string, Locator>;

  public readonly $recordingModal = {
    recordingModalHeading: this.page.getByRole('heading', { name: 'Recording with case ID' }),
    serviceIDInput: this.page.getByPlaceholder('Service ID'),
    locationCodeInput: this.page.getByPlaceholder('Location code'),
    caseIdInput: this.page.getByPlaceholder('Case ID'),
    cancel_close_Button: this.page.getByRole('button', { name: 'Cancel' }),
    okButton: this.page.getByRole('button', { name: 'Ok' }),
    saveButton: this.page.getByLabel('Save'),
    fileNameSavedText: this.page.getByText('Your file has been saved'),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.cvpSettingsUrl);
  }

  public async verifyUserIsOnCvpRoomSettingsPage(): Promise<void> {
    await expect(this.$interactive.selectRoomDropdown).toBeAttached();
    await this.closeRoomSettingsModal();
    await expect(this.$interactive.selectRoomDropdown).toBeVisible();
  }

  /**
   * Closes the room settings modal by clicking the "Close" button and waiting for the modal to be hidden.
   * This is a helper method used internally.
   */
  private async closeRoomSettingsModal(): Promise<void> {
    const modalHeading = this.page.getByRole('heading', { name: 'Room settings' });
    await expect(modalHeading).toBeVisible();
    await this.page.getByRole('button', { name: 'Close' }).click();
    await expect(modalHeading).toBeHidden();
  }

  /**
   * Selects a room from the dropdown by clicking the dropdown, expanding it,
   * and choosing the specified room name.
   * @param roomName - The room name to select ('PRE008' or 'PRE009').
   */
  public async selectRoomFromDropdown(roomName: 'PRE008' | 'PRE009' = 'PRE009'): Promise<void> {
    await this.$interactive.selectRoomDropdown.click();
    await expect(this.$interactive.selectRoomDropdown).toHaveAttribute('aria-expanded', 'true');
    await this.page.getByRole('link', { name: roomName }).click();
  }

  /**
   * Edits the room settings by clicking the edit button, clearing and filling the RTMPS link input,
   * verifying the input value, capturing the host PIN, and saving the settings.
   * @param rtmpsLink - The RTMPS link to set in the room settings.
   * @returns The captured host PIN as a string.
   */
  public async editRoomSettings(rtmpsLink: string): Promise<string> {
    await this.$interactive.editRoomSettingsButton.click();

    await this.$inputs.rmptsLinkInput.clear();
    await this.$inputs.rmptsLinkInput.fill(rtmpsLink);
    await expect(this.$inputs.rmptsLinkInput).toHaveValue(rtmpsLink);
    const hostPin = await this.captureHostPin();
    await this.$interactive.saveSettingsButton.click();

    return hostPin;
  }

  /**
   * Captures the host PIN by clicking the "Show" button, waiting for the "Hide" button,
   * and reading the value from the host PIN input.
   * @returns The host PIN as a string.
   */
  private async captureHostPin(): Promise<string> {
    await expect(this.page.getByRole('button', { name: 'Show' })).toBeEnabled();
    await this.page.getByRole('button', { name: 'Show' }).click();
    await expect(this.page.getByRole('button', { name: 'Hide' })).toBeVisible();
    const hostPin = await this.page.getByRole('spinbutton', { name: 'Host PIN:' }).inputValue();
    return hostPin;
  }

  /**
   * Begins recording by clicking the record button, filling in the required fields in the modal,
   * confirming and saving the recording, and verifying the file has been saved and the modal is closed.
   * @param serviceId - The service ID to enter.
   * @param locationCode - The location code to enter.
   * @param caseId - The case ID to enter.
   */
  public async beginRecording(serviceId: string, locationCode: string, caseId: string): Promise<void> {
    await this.$interactive.recordButton.click();
    await expect(this.$recordingModal.recordingModalHeading).toBeVisible();

    await this.$recordingModal.serviceIDInput.fill(serviceId);
    await expect(this.$recordingModal.serviceIDInput).toHaveValue(serviceId);

    await this.$recordingModal.locationCodeInput.fill(locationCode);
    await expect(this.$recordingModal.locationCodeInput).toHaveValue(locationCode);

    await this.$recordingModal.caseIdInput.fill(caseId);
    await expect(this.$recordingModal.caseIdInput).toHaveValue(caseId);

    await this.$recordingModal.okButton.click();
    await expect(this.$recordingModal.saveButton).toBeVisible();
    await this.$recordingModal.saveButton.click();

    await expect(this.$recordingModal.fileNameSavedText).toBeVisible();
    await this.$recordingModal.cancel_close_Button.click();

    await expect(this.$recordingModal.recordingModalHeading).toBeHidden();
    await expect(this.page.getByRole('button', { name: 'Recording' })).toBeVisible();
  }
}
